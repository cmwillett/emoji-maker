import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Slider, Typography, Stack, Tooltip } from '@mui/material'
import getCroppedImg from './utils/cropImage'
import SparkMD5 from 'spark-md5'
import { removeBackground } from './lib/removeBackground'
import { Modal } from '@mui/material'

const applyBackgroundColor = async (transparentBlob, backgroundColor) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((finalBlob) => {
        resolve(finalBlob)
      }, 'image/png')
    }
    img.src = URL.createObjectURL(transparentBlob)
  })
}

function UploadButtons({ onImageSelect }) {
  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => onImageSelect(reader.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <Stack direction="column" spacing={2} className="mt-4">
      <Tooltip title="User your device's camera to start with a new photo..." placement="right">
        <label className="btn-primary cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded shadow-md">
          Take Photo
          <input
            type="file"
            accept="image/*"
            hidden
            capture="environment"
            onChange={handleFileInput}
          />
        </label>
      </Tooltip>
      <Tooltip title="Choose an image from your gallery or file system to start..." placement="right">
        <label className="btn-primary cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded shadow-md">
          Choose from Gallery
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileInput}
          />
        </label>
      </Tooltip>
    </Stack>
  )
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('')
  const [borderStyle, setBorderStyle] = useState('solid')
  const [showShadow, setShowShadow] = useState(true)
  const [isRound, setIsRound] = useState(true)
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emojiCount, setEmojiCount] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handler = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowInstall(true)
      }

      window.addEventListener('beforeinstallprompt', handler)

      return () => {
        window.removeEventListener('beforeinstallprompt', handler)
      }
    }
  }, [])

  useEffect(() => {
    fetchEmojiCount()
  }, [])


  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null)
        setShowInstall(false)
      })
    }
  }

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      
      setLoading(true)
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 'image/png', true)
      console.log("Cropped blob: ", blob)

      const bgRemoved = await removeBackground(blob)
      console.log("Background removed: ", bgRemoved)
      if (!bgRemoved || bgRemoved instanceof Error) {
        throw new Error("Background removal failed")
      }
      if ('error' in bgRemoved && bgRemoved.error === 'no_foreground') {
        setErrorMessage("We couldn't detect a clear subject in the image. Try cropping closer or using a photo with more contrast.");
        setShowErrorModal(true);
        return;
      }
      let finalBlob
      if (backgroundColor) {
        finalBlob = await applyBackgroundColor(bgRemoved, backgroundColor)
      } else {
        finalBlob = bgRemoved
      }
      console.log("Final blob:", finalBlob)
      const finalUrl = URL.createObjectURL(finalBlob)
      console.log("Final image url:", finalUrl)
      setCroppedImage(finalUrl)
      await incrementEmojiCount()
    } catch (e) {
        console.error(e)
        setErrorMessage(
          e.message?.includes("background removal failed")
            ? "Something went wrong while removing the background. Please try again with a different image."
            : e.message || 'Something went wrong while processing the image.'
        );
        setShowErrorModal(true);
      } finally {
      setLoading(false)
    }
  }, [imageSrc, croppedAreaPixels, backgroundColor])

  const handleReset = () => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setCroppedImage(null)
  }

  const cropContainerStyle = {
    backgroundColor: '#fff',
    border: borderStyle === 'solid' ? '4px solid white' : 'none',
    borderRadius: isRound ? '9999px' : '0.5rem',
    boxShadow: showShadow ? '0 10px 15px rgba(0, 0, 0, 0.3)' : 'none',
    overflow: 'hidden',
  }

  const incrementEmojiCount = async () => {
    try {
      const res = await fetch('/api/increment-emoji-count')
      const data = await res.json()
      setEmojiCount(data.count)
      console.log('Total Emojis Created:', data.count)
    } catch (err) {
      console.error('Failed to update emoji count', err)
    }
  }

  const fetchEmojiCount = async () => {
    try {
      const res = await fetch('/api/getEmojiCount')
      const data = await res.json()
      setEmojiCount(data.count)
    } catch (err) {
      console.error('Failed to fetch emoji count', err)
    }
  }

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-4 p-4"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0 pointer-events-none"></div>
      <h1 className ="text-3xl font-bold text-emerald-400 drop-shadow-lg">The Craig's</h1> 
      <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-lg">Emoji Maker</h1>
      {emojiCount !== null && (
        <p className="text-sm text-emerald-400 mt-2 font-bold underline">
          {emojiCount.toLocaleString()} emojis created so far!
        </p>
      )}
      <Stack direction="row" spacing={2} className="mt-4">
        {showInstall && (
          <Tooltip title="Install this app to your home screen/desktop/taskbar for quick access!" placement="left">
            <button onClick={handleInstallClick} className="btn-primary cursor-pointer">
              Install App
            </button>
          </Tooltip>
        )}
        <Tooltip title="Reset the app and choose a new image..." placement="right">
          <button className="btn-primary cursor-pointer" onClick={handleReset}>
            Start Over
          </button>
        </Tooltip>
      </Stack>

      {!imageSrc && <UploadButtons onImageSelect={setImageSrc} />}

      {imageSrc && (
        <>
          <div className="relative w-80 h-80 mt-6" style={cropContainerStyle}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="w-80 mt-4">
            <p className="text-emerald-400 font-semibold drop-shadow-md mb-2">Zoom</p>
            <input
              type="range"
              value={zoom}
              min="1"
              max="3"
              step="0.1"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-blue-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-emerald-400 font-semibold drop-shadow-md mb-2">Choose Background Color</p>
            <div className="text-emerald-400 text-sm text-left mb-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Do nothing if you want to just remove the background...</li>
                <li>Choose a color if you want to use that color as your background...</li>
                <li>Click the "No BG" button if you want to go back to removing the background...</li>
                <li>Click the bottom square to create a custom color for your background...</li>
              </ul>
            </div>
            <div className="flex justify-center gap-2 mb-2">
              {["#ffffff", "#ffd700", "#87ceeb", "#ff69b4", "#000000"].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border cursor-pointer"
                  style={{ backgroundColor: color, borderColor: color === backgroundColor ? 'lime' : 'white' }}
                  onClick={() => setBackgroundColor(color)}
                ></button>
              ))}
            <button
              className="text-xs text-black bg-white border border-white rounded px-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => setBackgroundColor('')}
            >
              No BG
            </button>
            </div>
            <label className="block text-sm text-emerald-400 font-medium mb-1">
              Pick a Custom Background Color
            </label>
            <input
              type="color"
              value={backgroundColor || '#ffffff'}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="cursor-pointer"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-emerald-400 font-semibold drop-shadow-md mb-2">Emoji Style Options</p>

            <div className="flex flex-wrap justify-center gap-3 text-sm text-white">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={borderStyle === 'solid'}
                  onChange={(e) => setBorderStyle(e.target.checked ? 'solid' : 'none')}
                />
                Border
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showShadow}
                  onChange={(e) => setShowShadow(e.target.checked)}
                />
                Shadow
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={isRound}
                  onChange={(e) => setIsRound(e.target.checked)}
                />
                Circular Emoji
              </label>
            </div>
          </div>

          <button className="btn-primary mt-4 cursor-pointer" onClick={showCroppedImage}>
            Crop Image and Preview Emoji
          </button>
        </>
      )}

      {loading && (
        <div className="mt-6 flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
          <p className="text-emerald-400 mt-2">Processing your emoji...</p>
        </div>
      )}

      {croppedImage && (
        <div className="mt-6 flex flex-col items-center space-y-2">
          <h2 className="text-emerald-400 font-semibold drop-shadow-md mb-2">Cropped Emoji Preview:</h2>
          <div
            className={`w-32 h-32 flex items-center justify-center 
              ${isRound ? 'rounded-full' : 'rounded-lg'} 
              ${borderStyle === 'solid' ? 'border-4 border-white' : ''} 
              ${showShadow ? 'shadow-lg' : ''}`}
          >
            <img
              src={croppedImage}
              alt=""
              className={`w-full h-full object-cover ${isRound ? 'rounded-full' : 'rounded-lg'}`}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="btn-primary mt-4 cursor-pointer"
              onClick={() => {
                const link = document.createElement('a')
                link.href = croppedImage
                link.download = 'emoji.png'
                link.click()
              }}
            >
              Download Emoji
            </button>
          </div>
        </div>
      )}
      <Modal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
          <h2 id="error-modal-title" className="text-lg font-bold text-red-600 mb-2">Error</h2>
          <p id="error-modal-description" className="text-gray-700 mb-4">{errorMessage}</p>
          <button
            className="btn-primary w-full"
            onClick={() => setShowErrorModal(false)}
          >
            Close
          </button>
        </div>
      </Modal>
      <Modal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-lg font-bold text-emerald-600 mb-4">Contact Us</h2>

          {contactSubmitted ? (
            <p className="text-green-600">Thanks! Your message has been sent.</p>
          ) : (
            <>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full mb-2 px-3 py-2 border rounded"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full mb-2 px-3 py-2 border rounded"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full mb-4 px-3 py-2 border rounded"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
              <button
                className="btn-primary w-full"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/contact', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(contactForm),
                    });
                    if (res.ok) {
                      setContactSubmitted(true);
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Error sending message.');
                  }
                }}
              >
                Send Message
              </button>
            </>
          )}
        </div>
      </Modal>
      <footer className="mt-8 text-center text-emerald-400 text-sm">
        <p>
          © 2025 The Craig, Inc. ·{' '}
          <button
            onClick={() => setShowContactModal(true)}
            className="underline hover:text-white transition cursor-pointer"
          >
            Contact
          </button>
        </p>
      </footer>
    </div>
  )
}
