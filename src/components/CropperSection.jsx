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
  fontSize,
  isBold,
  isQuoteBubble,
  setIsQuoteBubble,
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

  const handleResizeTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault(); // <-- Add this
    isResizing.current = true;
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    initialBoxSize.current = { ...textBoxSize };
    document.addEventListener('touchmove', handleResizeTouchMove, { passive: false }); // <-- passive: false
    document.addEventListener('touchend', handleResizeTouchEnd);
  };

  const handleResizeTouchMove = (e) => {
    e.preventDefault(); // <-- Add this
    if (!isResizing.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;
    setTextBoxSize(prev => {
      const newWidth = Math.max(60, Math.min(initialBoxSize.current.width + deltaX, 300));
      const newHeight = Math.max(24, Math.min(initialBoxSize.current.height + deltaY, 200));
      return { width: newWidth, height: newHeight };
    });
  };

  const handleResizeTouchEnd = () => {
    isResizing.current = false;
    document.removeEventListener('touchmove', handleResizeTouchMove);
    document.removeEventListener('touchend', handleResizeTouchEnd);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault(); // <-- Add this
    isDragging.current = true;
    const touch = e.touches[0];
    startX.current = touch.clientX - textPosition.x;
    startY.current = touch.clientY - textPosition.y;
    document.addEventListener('touchmove', handleTouchMove, { passive: false }); // <-- passive: false
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // <-- Add this
    if (isResizing.current) return;
    if (!isDragging.current) return;
    const touch = e.touches[0];
    const newX = touch.clientX - startX.current;
    const newY = touch.clientY - startY.current;
    setTextPosition({
      x: Math.max(0, Math.min(newX, 320 - textBoxSize.width)),
      y: Math.max(0, Math.min(newY, 320 - textBoxSize.height)),
    });
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

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
    if (isResizing.current) return;
    if (!isDragging.current) return;
    const newX = e.clientX - startX.current;
    const newY = e.clientY - startY.current;
    setTextPosition({
      x: Math.max(0, Math.min(newX, 320 - textBoxSize.width)), // 320 = overlay width
      y: Math.max(0, Math.min(newY, 320 - textBoxSize.height)), // 320 = overlay height
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
        objectFit="contain"
      />
    {emojiText && (
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          left: textPosition.x,
          top: textPosition.y,
          width: textBoxSize.width,
          height: textBoxSize.height,
          // ...other styles...
          background: isQuoteBubble ? 'transparent' : 'rgba(0,0,0,0.5)',
          border: isQuoteBubble ? 'none' : '2px solid #fff',
          // ...other styles...
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        // ...handlers...
      >
      {isQuoteBubble && (
        <svg
          width={textBoxSize.width}
          height={textBoxSize.height + 20}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Rounded rectangle */}
          <rect
            x="0"
            y="0"
            width={textBoxSize.width}
            height={textBoxSize.height}
            rx="18"
            ry="18"
            fill="white"
            stroke="#333"
            strokeWidth="3"
          />
          {/* Bubble tail */}
          <polygon
            points={`
              ${textBoxSize.width * 0.2},${textBoxSize.height}
              ${textBoxSize.width * 0.2 + 12},${textBoxSize.height + 18}
              ${textBoxSize.width * 0.2 + 24},${textBoxSize.height}
            `}
            fill="white"
            stroke="#333"
            strokeWidth="3"
          />
        </svg>
      )}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          color: fontColor,
          fontWeight: isBold ? 'bold' : 'normal',
          fontSize: fontSize,
          fontFamily: 'sans-serif',
          lineHeight: 1.2,
          textShadow: '0 0 4px #000',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          cursor: 'move',
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
          width: 20, // larger size
          height: 20,
          background: 'rgba(255,255,255,0.85)', // brighter background
          border: '2px solid #007aff', // blue border for visibility
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          cursor: 'nwse-resize',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
            }}
              onMouseDown={(e) => {
          e.stopPropagation(); // Prevent drag from starting
          handleResizeMouseDown(e);
        }}
        onTouchStart={handleResizeTouchStart}
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