import React from 'react';
import Cropper from 'react-easy-crop';
import customBackgrounds from '../constants/customBackgrounds';
import { useRef } from 'react';

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
  emojiText,
  fontColor,
  textPosition,
  setTextPosition,
  textBoxSize,
  setTextBoxSize
}) {
  const textRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const resizeHandleRef = useRef(null);
  const isResizing = useRef(false);
  const initialBoxSize = useRef({ width: 0, height: 0 });

  const handleResizeMouseDown = (e) => {
  e.stopPropagation();
  isResizing.current = true;
  startX.current = e.clientX;
  startY.current = e.clientY;
  initialBoxSize.current = { ...textBoxSize };
  document.addEventListener('mousemove', handleResizeMouseMove);
  document.addEventListener('mouseup', handleResizeMouseUp);
};

const handleResizeMouseMove = (e) => {
  if (!isResizing.current) return;
  const deltaX = e.clientX - startX.current;
  const deltaY = e.clientY - startY.current;
  setTextBoxSize(prev => {
    const newWidth = Math.max(60, Math.min(initialBoxSize.current.width + deltaX, 300));
    const newHeight = Math.max(24, Math.min(initialBoxSize.current.height + deltaY, 200));
    return { width: newWidth, height: newHeight };
  });
};

const handleResizeMouseUp = () => {
  isResizing.current = false;
  document.removeEventListener('mousemove', handleResizeMouseMove);
  document.removeEventListener('mouseup', handleResizeMouseUp);
};

  const handleMouseDown = (e) => {
    e.stopPropagation(); // Prevent Cropper from handling the drag
    isDragging.current = true;
    startX.current = e.clientX - textPosition.x;
    startY.current = e.clientY - textPosition.y;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

const handleMouseMove = (e) => {
  if (isResizing.current) return; // Don't drag while resizing
  if (!isDragging.current) return;
  setTextPosition({
    x: e.clientX - startX.current,
    y: e.clientY - startY.current,
  });
};

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

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
{emojiText && (
  <div
    ref={textRef}
    style={{
      position: 'absolute',
      left: textPosition.x,
      top: textPosition.y,
      color: fontColor,
      cursor: 'move',
      userSelect: 'none',
      fontWeight: 'bold',
      fontSize: 24,
      textShadow: '0 0 4px #000',
      width: textBoxSize.width,
      height: textBoxSize.height,
      maxWidth: 300,
      maxHeight: 200,
      overflow: 'hidden',
      background: 'rgba(0,0,0,0.1)',
      padding: 4,
      boxSizing: 'border-box',
    }}
    onMouseDown={handleMouseDown}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
      }}
    >
      {emojiText}
    </div>
    {/* Resize handle */}
    <div
      ref={resizeHandleRef}
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 16,
        height: 16,
        background: 'rgba(0,0,0,0.3)',
        cursor: 'nwse-resize',
        zIndex: 10,
      }}
        onMouseDown={(e) => {
    e.stopPropagation(); // Prevent drag from starting
    handleResizeMouseDown(e);
  }}
    />
  </div>
)}     
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