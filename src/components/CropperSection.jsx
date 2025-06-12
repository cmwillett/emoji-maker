import Cropper from 'react-easy-crop';
import customBackgrounds from '../constants/customBackgrounds';
import { useRef } from 'react';

// Map background type to image URL for custom backgrounds
const patternMap = Object.fromEntries(
  customBackgrounds.map(bg => [bg.title, bg.img])
);

/**
 * CropperSection component displays the cropping UI and draggable/resizable text overlay.
 * Handles background, cropping, text box movement, resizing, and quote bubble tail logic.
 * 
 * @param {object} props - All cropper and overlay state/handlers from parent.
 */
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
  //emojiText,
  fontColor,
  fontSize,
  isBold,
  //isQuoteBubble,
  //setIsQuoteBubble,
  //textPosition,
  //setTextPosition,
  //textBoxSize,
  //setTextBoxSize,
  textBoxes,
  setTextBoxes,
  tailBase,
  setTailBase,
  arrowTip,
  setArrowTip,
  handleResizeTextBox
}) {
  // Refs for drag/resize state and DOM nodes
  const textRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const resizeHandleRef = useRef(null);
  const isResizing = useRef(false);
  const initialBoxSize = useRef({ width: 0, height: 0 });
  const arrowTipRef = useRef(null);
  const dragBoxIdx = useRef(null);
  const resizeBoxIdx = useRef(null);

  // --- Touch handler for dragging the quote bubble tail ---
  const handleTailTouchStart = (e) => {
    e.stopPropagation();
    //e.preventDefault();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const origX = tailBase.x;
    const origY = tailBase.y;

    const onTouchMove = (moveEvent) => {
      moveEvent.preventDefault();
      const moveTouch = moveEvent.touches[0];
      let newX = origX + (moveTouch.clientX - startX);
      let newY = origY + (moveTouch.clientY - startY);

      // Clamp to bubble border
      if (newY < 0) newY = 0;
      if (newY > textBoxSize.height) newY = textBoxSize.height;
      if (newX < 0) newX = 0;
      if (newX > textBoxSize.width) newX = textBoxSize.width;

      // Snap to closest edge
      const distances = [
        { edge: 'top', dist: Math.abs(newY) },
        { edge: 'bottom', dist: Math.abs(newY - textBoxSize.height) },
        { edge: 'left', dist: Math.abs(newX) },
        { edge: 'right', dist: Math.abs(newX - textBoxSize.width) }
      ];
      const closest = distances.reduce((a, b) => (a.dist < b.dist ? a : b));
      if (closest.edge === 'top') newY = 0;
      if (closest.edge === 'bottom') newY = textBoxSize.height;
      if (closest.edge === 'left') newX = 0;
      if (closest.edge === 'right') newX = textBoxSize.width;

      // Calculate direction for the tip (outward from the bubble)
      let tipOffset = 24;
      let tipX = newX, tipY = newY;
      if (closest.edge === 'top') tipY = newY - tipOffset;
      if (closest.edge === 'bottom') tipY = newY + tipOffset;
      if (closest.edge === 'left') tipX = newX - tipOffset;
      if (closest.edge === 'right') tipX = newX + tipOffset;

      setTailBase({ x: newX, y: newY });
      setArrowTip({ x: tipX, y: tipY });
    };

    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  };

  // --- Touch and mouse handlers for resizing the text box ---
  const handleResizeTouchStart = (e, idx) => {
    e.stopPropagation();
    isResizing.current = true;
    resizeBoxIdx.current = idx;
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    initialBoxSize.current = { ...textBoxes[idx].size }; // <-- Use the correct box size
    document.addEventListener('touchmove', handleResizeTouchMove, { passive: false });
    document.addEventListener('touchend', handleResizeTouchEnd);
  };
  const handleResizeTouchMove = (e) => {
    e.preventDefault();
    if (!isResizing.current || resizeBoxIdx.current === null) return;
    const idx = resizeBoxIdx.current; // <-- Fix: get idx from ref
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;
    handleResizeTextBox({
      width: Math.max(60, Math.min(initialBoxSize.current.width + deltaX, 300)),
      height: Math.max(24, Math.min(initialBoxSize.current.height + deltaY, 200))
    }, idx);
  };
  const handleResizeTouchEnd = () => {
    isResizing.current = false;
    document.removeEventListener('touchmove', handleResizeTouchMove);
    document.removeEventListener('touchend', handleResizeTouchEnd);
  };

  // --- Touch and mouse handlers for dragging the text box ---
  const handleTouchStart = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    isDragging.current = true;
    const touch = e.touches[0];
    // Use the position of the box being dragged
    startX.current = touch.clientX - textBoxes[idx].position.x;
    startY.current = touch.clientY - textBoxes[idx].position.y;
    dragBoxIdx.current = idx;
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    if (isResizing.current || !isDragging.current || dragBoxIdx.current === null) return;
    const idx = dragBoxIdx.current;
    const box = textBoxes[idx];
    const touch = e.touches[0];
    const newX = touch.clientX - startX.current;
    const newY = touch.clientY - startY.current;
    setTextBoxes(prev => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        position: {
          x: Math.max(0, Math.min(newX, 320 - box.size.width)),
          y: Math.max(0, Math.min(newY, 320 - box.size.height)),
        }
      };
      return updated;
    });
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    dragBoxIdx.current = null;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const handleResizeMouseDown = (e, idx) => {
    e.stopPropagation();
    isResizing.current = true;
    resizeBoxIdx.current = idx;
    startX.current = e.clientX;
    startY.current = e.clientY;
    initialBoxSize.current = { ...textBoxes[idx].size };
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  };
const handleResizeMouseMove = (e) => {
  if (!isResizing.current || resizeBoxIdx.current === null) return;
  const idx = resizeBoxIdx.current;
  const deltaX = e.clientX - startX.current;
  const deltaY = e.clientY - startY.current;
  setTextBoxes(prev => {
    const updated = [...prev];
    const oldBox = updated[idx];
    const oldSize = initialBoxSize.current;
    const newWidth = Math.max(60, Math.min(oldSize.width + deltaX, 300));
    const newHeight = Math.max(24, Math.min(oldSize.height + deltaY, 200));
    let newTailBase = oldBox.tailBase;
    let newArrowTip = oldBox.arrowTip;

    if (oldBox.isQuoteBubble && oldBox.tailBase && oldBox.arrowTip) {
      const epsilon = 2;
      const oldW = oldSize.width;
      const oldH = oldSize.height;
      const newW = newWidth;
      const newH = newHeight;
      let edge = null;
      let rel = 0;

      // Detect which edge the tailBase was on
      if (Math.abs(oldBox.tailBase.y) < epsilon) {
        edge = 'top';
        rel = oldBox.tailBase.x / oldW;
      } else if (Math.abs(oldBox.tailBase.y - oldH) < epsilon) {
        edge = 'bottom';
        rel = oldBox.tailBase.x / oldW;
      } else if (Math.abs(oldBox.tailBase.x) < epsilon) {
        edge = 'left';
        rel = oldBox.tailBase.y / oldH;
      } else if (Math.abs(oldBox.tailBase.x - oldW) < epsilon) {
        edge = 'right';
        rel = oldBox.tailBase.y / oldH;
      } else {
        // fallback: bottom center
        edge = 'bottom';
        rel = 0.5;
      }

      // Calculate new tailBase on the same edge and relative position
      if (edge === 'top') {
        newTailBase = { x: Math.round(rel * newW), y: 0 };
      } else if (edge === 'bottom') {
        newTailBase = { x: Math.round(rel * newW), y: newH };
      } else if (edge === 'left') {
        newTailBase = { x: 0, y: Math.round(rel * newH) };
      } else if (edge === 'right') {
        newTailBase = { x: newW, y: Math.round(rel * newH) };
      }

      // Arrow tip offset
      const tipOffset = 24; //Math.max(16, Math.round(Math.min(newW, newH) * 0.18));
      let tipX = newTailBase.x, tipY = newTailBase.y;
      if (edge === 'top') tipY = newTailBase.y - tipOffset;
      else if (edge === 'bottom') tipY = newTailBase.y + tipOffset;
      else if (edge === 'left') tipX = newTailBase.x - tipOffset;
      else if (edge === 'right') tipX = newTailBase.x + tipOffset;

      newArrowTip = { x: tipX, y: tipY };
    }

      updated[idx] = {
        ...oldBox,
        size: { width: newWidth, height: newHeight },
        tailBase: newTailBase,
        arrowTip: newArrowTip
      };
      return updated;
    }, idx);
  };
  const handleResizeMouseUp = () => {
    isResizing.current = false;
    resizeBoxIdx.current = null;
    document.removeEventListener('mousemove', handleResizeMouseMove);
    document.removeEventListener('mouseup', handleResizeMouseUp);
  };

  const handleMouseDown = (e, idx) => {
    e.stopPropagation();
    isDragging.current = true;
    dragBoxIdx.current = idx;
    startX.current = e.clientX - textBoxes[idx].position.x;
    startY.current = e.clientY - textBoxes[idx].position.y;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  const handleMouseMove = (e) => {
    if (isResizing.current || !isDragging.current || dragBoxIdx.current === null) return;
    const idx = dragBoxIdx.current;
    const box = textBoxes[idx];
    const newX = e.clientX - startX.current;
    const newY = e.clientY - startY.current;
    setTextBoxes(prev => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        position: {
          x: Math.max(0, Math.min(newX, 320 - box.size.width)),
          y: Math.max(0, Math.min(newY, 320 - box.size.height)),
        }
      };
      return updated;
    });
  };
  const handleMouseUp = () => {
    isDragging.current = false;
    dragBoxIdx.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Don't render if no image is loaded
  if (!imageSrc) return null;

  // Compute background style for crop area (color, pattern, or transparent)
  const getBackgroundStyle = () => {
    if (backgroundColor) {
      return { background: backgroundColor };
    }
    // Check if backgroundType matches a custom background title
    const imgUrl = patternMap[backgroundType];
    if (imgUrl) {
      return {
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { background: backgroundType === 'remove' ? 'transparent' : '#fff' };
  };

  return (
    <>
      {/* Cropper area with background and overlay */}
      <div className="relative w-80 h-80 mt-6"
        style={{ cropContainerStyle, ...getBackgroundStyle() }}
      >
        {/* Main image cropper */}
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
        {/* Draggable/resizable text overlay and quote bubble */}
        {textBoxes.map((box, idx) => (
          <div
            key={box.id}
            onMouseDown={e => handleMouseDown(e, idx)}
            ref={textRef}
            style={{
              position: 'absolute',
              left: box.position.x,
              top: box.position.y,
              width: box.size.width,
              height: box.size.height,
              background: box.isQuoteBubble ? 'transparent' : 'rgba(0,0,0,0.5)',
              border: box.isQuoteBubble ? 'none' : '2px solid #fff',
            }}
            // You will need to update your drag/resize handlers to work per box!
            onTouchStart={e => handleTouchStart(e, idx)}
          >

          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 20,
              height: 20,
              background: 'rgba(255,255,255,0.85)',
              border: '2px solid #007aff',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              cursor: 'nwse-resize',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseDown={e => handleResizeMouseDown(e, idx)}
            onTouchStart={e => handleResizeTouchStart(e, idx)} // <-- Add this line
          />    
    {/* SVG quote bubble and tail if enabled */}
    {box.isQuoteBubble && box.text && (
      <svg
        width={box.size.width + 48}
        height={box.size.height + 48}
        style={{
          position: 'absolute',
          left: -24,
          top: -24,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <rect
          x={24}
          y={24}
          width={box.size.width}
          height={box.size.height}
          rx="18"
          ry="18"
          fill="lightgray"
          stroke="#333"
          strokeWidth="3"
        />
    {/* Bubble tail polygon */}
    <polygon
      points={(() => {
        let base1, base2;
        const offset = 12;
        const epsilon = 2;
        const { tailBase, arrowTip, size } = box;
        if (!tailBase || !arrowTip) return '';
        if (Math.abs(tailBase.y) < epsilon) { // top
          base1 = [tailBase.x - offset + 24, tailBase.y + 24];
          base2 = [tailBase.x + offset + 24, tailBase.y + 24];
        } else if (Math.abs(tailBase.y - size.height) < epsilon) { // bottom
          base1 = [tailBase.x - offset + 24, tailBase.y + 24];
          base2 = [tailBase.x + offset + 24, tailBase.y + 24];
        } else if (Math.abs(tailBase.x) < epsilon) { // left
          base1 = [tailBase.x + 24, tailBase.y - offset + 24];
          base2 = [tailBase.x + 24, tailBase.y + offset + 24];
        } else if (Math.abs(tailBase.x - size.width) < epsilon) { // right
          base1 = [tailBase.x + 24, tailBase.y - offset + 24];
          base2 = [tailBase.x + 24, tailBase.y + offset + 24];
        } else {
          // fallback to bottom
          base1 = [tailBase.x - offset + 24, tailBase.y + 24];
          base2 = [tailBase.x + offset + 24, tailBase.y + 24];
        }
        return `
          ${base1[0]},${base1[1]}
          ${base2[0]},${base2[1]}
          ${arrowTip.x + 24},${arrowTip.y + 24}
        `;
      })()}
      fill="white"
      stroke="#333"
      strokeWidth="3"
    />
    </svg> 
  )}
  {box.isQuoteBubble && (
    <div
      style={{
        position: 'absolute',
        left: (box.tailBase?.x ?? box.size.width / 2) - 20,
        top: (box.tailBase?.y ?? box.size.height) - 20,
        width: 40,
        height: 40,
        background: 'transparent',
        cursor: 'pointer',
        zIndex: 30,
      }}
      onMouseDown={e => {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const origX = box.tailBase?.x ?? box.size.width / 2;
        const origY = box.tailBase?.y ?? box.size.height;
        const onMouseMove = moveEvent => {
          let newX = origX + (moveEvent.clientX - startX);
          let newY = origY + (moveEvent.clientY - startY);

          // Clamp and snap logic
          const distances = [
            { edge: 'top', dist: Math.abs(newY) },
            { edge: 'bottom', dist: Math.abs(newY - box.size.height) },
            { edge: 'left', dist: Math.abs(newX) },
            { edge: 'right', dist: Math.abs(newX - box.size.width) }
          ];
          const closest = distances.reduce((a, b) => (a.dist < b.dist ? a : b));
          if (closest.edge === 'top') newY = 0;
          if (closest.edge === 'bottom') newY = box.size.height;
          if (closest.edge === 'left') newX = 0;
          if (closest.edge === 'right') newX = box.size.width;

          // Arrow tip logic
          let tipOffset = 24;
          let tipX = newX, tipY = newY;
          if (closest.edge === 'top') tipY = newY - tipOffset;
          if (closest.edge === 'bottom') tipY = newY + tipOffset;
          if (closest.edge === 'left') tipX = newX - tipOffset;
          if (closest.edge === 'right') tipX = newX + tipOffset;

          setTextBoxes(prev => {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              tailBase: { x: newX, y: newY },
              arrowTip: { x: tipX, y: tipY }
            };
            return updated;
          });
        };
        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }}
      onTouchStart={e => {
        e.stopPropagation();
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        const origX = box.tailBase?.x ?? box.size.width / 2;
        const origY = box.tailBase?.y ?? box.size.height;
        const onTouchMove = moveEvent => {
          moveEvent.preventDefault();
          const moveTouch = moveEvent.touches[0];
          let newX = origX + (moveTouch.clientX - startX);
          let newY = origY + (moveTouch.clientY - startY);

          // Clamp and snap logic
          const distances = [
            { edge: 'top', dist: Math.abs(newY) },
            { edge: 'bottom', dist: Math.abs(newY - box.size.height) },
            { edge: 'left', dist: Math.abs(newX) },
            { edge: 'right', dist: Math.abs(newX - box.size.width) }
          ];
          const closest = distances.reduce((a, b) => (a.dist < b.dist ? a : b));
          if (closest.edge === 'top') newY = 0;
          if (closest.edge === 'bottom') newY = box.size.height;
          if (closest.edge === 'left') newX = 0;
          if (closest.edge === 'right') newX = box.size.width;

          // Arrow tip logic
          let tipOffset = 24;
          let tipX = newX, tipY = newY;
          if (closest.edge === 'top') tipY = newY - tipOffset;
          if (closest.edge === 'bottom') tipY = newY + tipOffset;
          if (closest.edge === 'left') tipX = newX - tipOffset;
          if (closest.edge === 'right') tipX = newX + tipOffset;

          setTextBoxes(prev => {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              tailBase: { x: newX, y: newY },
              arrowTip: { x: tipX, y: tipY }
            };
            return updated;
          });
        };
        const onTouchEnd = () => {
          window.removeEventListener('touchmove', onTouchMove);
          window.removeEventListener('touchend', onTouchEnd);
        };
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
      }}
    />
  )}
    {/* Tail base drag handle, update to use box-specific tailBase/arrowTip if needed */}
    {/* ... */}
    {/* Text content */}
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%',
        color: box.fontColor,
        fontWeight: box.isBold ? 'bold' : 'normal',
        fontSize: box.fontSize,
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
        pointerEvents: 'none', // Prevent text selection
      }}
    >
      {box.text}
    </div>
    {/* Resize handle, update to work per box */}
    {/* ... */}
  </div>
))}
      </div>
      {/* Zoom slider for adjusting crop zoom */}
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