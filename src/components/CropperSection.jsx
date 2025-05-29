import React from 'react';
import Cropper from 'react-easy-crop';

export default function CropperSection({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  onCropComplete,
  cropContainerStyle,
}) {
  if (!imageSrc) return null;

  return (
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
    </>
  );
}