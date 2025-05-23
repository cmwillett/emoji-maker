// src/ImageCropper.jsx
import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from './utils/cropImage'
import { Slider } from '@mui/material' // Optional: for zoom control

export default function ImageCropper({ imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    onCropComplete(croppedAreaPixels)
  }, [onCropComplete])

  return (
    <div className="relative w-full h-[400px] bg-gray-900">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1} // square aspect ratio for emojis
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
      <div className="absolute bottom-2 left-2 right-2">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, z) => setZoom(z)}
        />
      </div>
    </div>
  )
}
