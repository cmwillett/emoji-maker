import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Slider, Typography, Stack, Tooltip } from '@mui/material'
import getCroppedImg from './utils/cropImage'
import SparkMD5 from 'spark-md5'
import { removeBackground } from './lib/removeBackground'
import { Modal } from '@mui/material'
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import ShareIcon from '@mui/icons-material/Share';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { EmojiButton } from './components/EmojiButton';
import heic2any from 'heic2any';

import Header from './components/Header';
import InstallShareButtons from './components/InstallShareButtons';
import CropperSection from './components/CropperSection';
import BackgroundColorPicker from './components/BackgroundColorPicker';
import StyleOptions from './components/StyleOptions';
import EmojiPreview from './components/EmojiPreview';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorModal from './components/ErrorModal';

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
  const handleFileInput = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a HEIC image
    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/png",
        });

        // Convert Blob to Data URL
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            onImageSelect(reader.result);
          }
        };
        reader.readAsDataURL(convertedBlob);
      } catch (error) {
        console.error("HEIC conversion failed:", error);
        alert("Failed to process HEIC image. Please try another format.");
      }
    } else {
      // Regular image handling
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Stack direction="column" spacing={2} className="mt-4 items-center">
      <Tooltip title="Use your device's camera to take a new photo..." placement="right">
        <div>
          <EmojiButton
            icon={<CameraAltIcon />}
            label={
              <>
                Take Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </>
            }
            component="label"
          />
        </div>
      </Tooltip>

      <Tooltip title="Choose an image from your gallery or file system..." placement="right">
        <div>
          <EmojiButton
            icon={<PhotoLibraryIcon />}
            label={
              <>
                Choose from Gallery
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </>
            }
            component="label"
          />
        </div>
      </Tooltip>
    </Stack>
  );
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
  const [showAboutModal, setShowAboutModal] = useState(false);

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
      setLoading(true);

      // Step 1: Crop the image
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 'image/png', true);
      console.log("Cropped blob:", blob);

      // Step 2: Remove the background
      const bgRemoved = await removeBackground(blob);
      console.log("Background removed:", bgRemoved);

      // Handle specific error conditions
      if (!bgRemoved || bgRemoved instanceof Error || (typeof bgRemoved === 'object' && bgRemoved.error)) {
        if (bgRemoved?.error === 'no_foreground') {
          setErrorMessage("We couldn't detect a clear subject in the image. Try cropping closer or using a photo with more contrast.");
        } else {
          setErrorMessage("Something went wrong while removing the background. Please try again with a different image.");
        }
        setShowErrorModal(true);
        return;
      }

      // Step 3: Apply background color if selected
      let finalBlob;
      if (backgroundColor) {
        finalBlob = await applyBackgroundColor(bgRemoved, backgroundColor);
      } else {
        finalBlob = bgRemoved;
      }

      console.log("Final blob:", finalBlob);

      // Step 4: Generate final image preview
      const finalUrl = URL.createObjectURL(finalBlob);
      console.log("Final image URL:", finalUrl);
      setCroppedImage(finalUrl);

      // Step 5: Increment the emoji counter
      await incrementEmojiCount();
    } catch (e) {
      console.error(e);
      setErrorMessage(
        e.message?.includes("background removal failed")
          ? "Something went wrong while removing the background. Please try again with a different image."
          : e.message || 'Something went wrong while processing the image.'
      );
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, backgroundColor]);

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
      <Header emojiCount={emojiCount} />
      <InstallShareButtons showInstall={showInstall} handleInstallClick={handleInstallClick} />
      {!imageSrc && <UploadButtons onImageSelect={setImageSrc} />}

      {imageSrc && (
        <>
          <CropperSection
            imageSrc={imageSrc}
            crop={crop}
            setCrop={setCrop}
            zoom={zoom}
            setZoom={setZoom}
            onCropComplete={onCropComplete}
            cropContainerStyle={cropContainerStyle}
          />
          <BackgroundColorPicker
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
          />
          <StyleOptions
            borderStyle={borderStyle}
            setBorderStyle={setBorderStyle}
            showShadow={showShadow}
            setShowShadow={setShowShadow}
            isRound={isRound}
            setIsRound={setIsRound}
          />

          <button className="btn-primary mt-4 cursor-pointer" onClick={showCroppedImage}>
            Crop Image and Preview Emoji
          </button>
          <button className="btn-primary mt-4 cursor-pointer" onClick={handleReset}>
            Start Over
          </button>

        </>
      )}

      {loading && <LoadingIndicator />}

      <EmojiPreview
        croppedImage={croppedImage}
        isRound={isRound}
        borderStyle={borderStyle}
        showShadow={showShadow}
        onShareMobile={async () => {
          try {
            const response = await fetch(croppedImage);
            const blob = await response.blob();
            const file = new File([blob], "emoji.png", { type: blob.type });

            if (navigator.share && navigator.canShare?.({ files: [file] })) {
              await navigator.share({
                title: "My Custom Emoji",
                text: "Check out this emoji I made!",
                files: [file],
              });
            } else {
              alert("❌ Mobile sharing not supported on this device.");
            }
          } catch (error) {
            console.error(error);
            alert("❌ Failed to share via mobile.");
          }
        }}
        onShareClipboard={async () => {
          try {
            const response = await fetch(croppedImage);
            const blob = await response.blob();

            if (navigator.clipboard && window.ClipboardItem) {
              const item = new ClipboardItem({ [blob.type]: blob });
              await navigator.clipboard.write([item]);
              alert("✅ Emoji image copied! You can now paste it into messaging apps.");
            } else {
              alert("❌ Image clipboard not supported on this browser.");
            }
          } catch (err) {
            console.error(err);
            alert("❌ Failed to copy image to clipboard.");
          }
        }}
        onDownload={() => {
          const defaultName = "emoji";
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const tempName = `${defaultName}-${timestamp}`;
          const userInput = prompt("Enter filename (without extension):", tempName);
          if (userInput === null) return;

          const finalName = `${userInput || defaultName}.png`;
          const link = document.createElement("a");
          link.href = croppedImage;
          link.download = finalName;
          link.click();
        }}
      />
      <ErrorModal
        open={showErrorModal}
        errorMessage={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
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
      <Modal
        open={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        aria-labelledby="about-modal-title"
        aria-describedby="about-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-gray-800">
          <h2 id="about-modal-title" className="text-lg font-bold mb-2">About this App</h2>
          <p id="about-modal-description" className="mb-4 text-sm">
            This emoji maker lets you turn any photo into a custom emoji. Not an emoji that you can use in messaging apps straight away 
            (those are unicode and are part of the actual app, so this wouldn't be able to do so).
            Here are a few things you can do with the app though:
              - crop the photo
              - remove the background
              - choose a background color
              - apply styles like borders or shadows
            Once you have it set, you can then:
              - share your emoji
              - copy it to clipboard
              - download it
          </p>
          <button
            className="btn-primary w-full"
            onClick={() => setShowAboutModal(false)}
          >
            Close
          </button>
        </div>
      </Modal>
      <footer className="mt-8 w-full text-center space-y-2">
        <div className="flex justify-center gap-4">
          <button
            className="px-3 py-1 rounded bg-white bg-opacity-20 text-emerald-100 font-medium backdrop-blur hover:bg-opacity-30 hover:text-white transition"
            onClick={() => setShowAboutModal(true)}
          >
            About this app
          </button>
          <button
            className="px-3 py-1 rounded bg-white bg-opacity-20 text-emerald-100 font-medium backdrop-blur hover:bg-opacity-30 hover:text-white transition"
            onClick={() => setShowContactModal(true)}
          >
            Contact
          </button>
        </div>
        <p className="text-xs text-emerald-500 mt-1">© 2025 The Craig, Inc.</p>
      </footer>
    </div>
  )
}
