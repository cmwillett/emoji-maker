import React from 'react';
import Cropper from 'react-easy-crop';
import customBackgrounds from '../constants/customBackgrounds';

const patternMap = Object.fromEntries(
  customBackgrounds.map(bg => [bg.type, bg.img])
);  

export default function CropperSection({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  onCropComplete,
  cropContainerStyle,
  backgroundType, 
  backgroundColor,
  patternTypes,
}) {
  if (!imageSrc) return null;
  //console.log('Background Type:', backgroundType);
  //console.log('Background Color:', backgroundColor);
  //console.log('Pattern Types:', patternTypes);
const getBackgroundStyle = () => {
  if (backgroundColor) {
    return { background: backgroundColor };
  } else if (patternTypes && patternTypes.includes(backgroundType)) {
    const imgUrl = patternMap[backgroundType];
    if (imgUrl) {
      return {
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
  }
  return { background: backgroundType === 'remove' ? 'transparent' : '#fff' };
};
  return (
    <>
      <div className="relative w-80 h-80 mt-6"
      style={{cropContainerStyle, ...getBackgroundStyle()}}
    >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape="rect"
          showGrid={false}
          restrictPosition={false}
        />
      </div>
      <div className="w-80 mt-4">
        <p className="text-center text-emerald-400 font-semibold drop-shadow-md mb-2">Zoom Slider</p>
        <input
          type="range"
          value={zoom}
          min="0.2"
          max="3"
          step="0.1"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-2 bg-blue-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </>
  );
}