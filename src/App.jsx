import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Slider, Typography } from '@mui/material'
import getCroppedImg from './utils/cropImage'

export default function App() {
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImageSrc(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [imageSrc, croppedAreaPixels])

  const handleReset = () => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setCroppedImage(null)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
      <h1 className="text-3xl font-bold">Emoji Maker</h1>
      {showInstall && (
        <button
          onClick={handleInstallClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Install App
        </button>
      )}
      <Button
        variant="text"
        color="error"
        onClick={handleReset}
      >
        Start Over
      </Button>

      {!imageSrc && (
        <Button
          variant="contained"
          component="label"
          className="mt-4"
        >
          Upload Image
          <input
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={handleImageChange}
          />
        </Button>
      )}

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
            <Typography gutterBottom>Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, newZoom) => setZoom(newZoom)}
            />
          </div>

          <Button
            variant="contained"
            className="mt-4"
            onClick={showCroppedImage}
          >
            Crop Image
          </Button>
        </>
      )}

      {croppedImage && (
        <div className="mt-6 flex flex-col items-center space-y-2">
          <Typography variant="h6" className="mb-2">Cropped Emoji Preview:</Typography>
          <img
            src={croppedImage}
            alt=""
            className="w-32 h-32 object-cover rounded-full border"
          />
          <div className="flex gap-2">
            <Button
              variant="outlined"
              className="mt-4"
              onClick={() => {
                const link = document.createElement('a')
                link.href = croppedImage
                link.download = 'emoji.png'
                link.click()
              }}
            >
              Download Emoji
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
