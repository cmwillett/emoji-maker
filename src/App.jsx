import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Slider, Typography, Stack, Tooltip } from '@mui/material'
import getCroppedImg from './utils/cropImage'
import SparkMD5 from 'spark-md5'

const removeBackground = async (imageBlob) => {
  const formData = new FormData()
  formData.append('image_file', imageBlob, 'image.png')
  formData.append('size', 'auto')

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': import.meta.env.VITE_REMOVEBG_API_KEY,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  return await response.blob()
}

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

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
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

      const bgRemoved = await removeBackground(blob)
      let finalBlob
      if (backgroundColor) {
        finalBlob = await applyBackgroundColor(bgRemoved, backgroundColor)
      } else {
        finalBlob = bgRemoved
      }
      const finalUrl = URL.createObjectURL(finalBlob)
      setCroppedImage(finalUrl)
    } catch (e) {
      console.error(e)
      alert(e.message || 'Something went wrong while processing the image.')
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
      <Stack direction="row" spacing={2} className="mt-4">
        {showInstall && (
          <Tooltip title="Install this app to your home screen/desktop/taskbar for quick access!" placement="left">
            <button onClick={handleInstallClick} className="btn-primary">
              Install App
            </button>
          </Tooltip>
        )}
        <Tooltip title="Reset the app and choose a new image..." placement="right">
          <button className="btn-primary" onClick={handleReset}>
            Start Over
          </button>
        </Tooltip>
      </Stack>

      {!imageSrc && <UploadButtons onImageSelect={setImageSrc} />}

      {imageSrc && (
        <>
          <div className="relative w-80 h-80 mt-6">
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
            <p className="text-sm text-white mb-2">1. Choosing a color will change the background color.</p>
            <p className="text-sm text-white mb-2">2. Choosing nothing will remove the background altogether. </p>
            <p className="text-sm text-white mb-2">3. Clicking the square will open a custom color picker. </p>
            <p className="text-sm text-white mb-2">4. Clicking the square to the right of the colors will reset it back to blank.</p>
            <div className="flex justify-center gap-2 mb-2">
              {["#ffffff", "#ffd700", "#87ceeb", "#ff69b4", "#000000"].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: color, borderColor: color === backgroundColor ? 'lime' : 'white' }}
                  onClick={() => setBackgroundColor(color)}
                ></button>
              ))}
            <button
              className="text-xs text-black bg-white border border-white rounded px-2 hover:bg-gray-200"
              onClick={() => setBackgroundColor('')}
            >
              No BG
            </button>
            </div>
            <input
              type="color"
              value={backgroundColor || '#ffffff'}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="cursor-pointer"
            />
          </div>

          <button className="btn-primary mt-4" onClick={showCroppedImage}>
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
          <img
            src={croppedImage}
            alt=""
            className="w-32 h-32 object-cover rounded-full border"
          />
          <div className="flex gap-2">
            <button
              className="btn-primary mt-4"
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
    </div>
  )
}
