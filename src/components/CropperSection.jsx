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
  setTextBoxSize,
  tailBase,
  setTailBase,
  arrowTip,
  setArrowTip,
  handleResizeTextBox
}) {
  const textRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const resizeHandleRef = useRef(null);
  const isResizing = useRef(false);
  const initialBoxSize = useRef({ width: 0, height: 0 });

  /*const [arrowTip, setArrowTip] = useState({
    x: textBoxSize.width * 0.2 + 12, // initial X (matches your current arrow)
    y: textBoxSize.height + 18       // initial Y (matches your current arrow)
  });*/
  const arrowTipRef = useRef(null);

  /*const [tailBase, setTailBase] = useState({
    x: textBoxSize.width / 2, // start at center bottom
    y: textBoxSize.height     // start at bottom edge
  });*/

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
    handleResizeTextBox({
      width: Math.max(60, Math.min(initialBoxSize.current.width + deltaX, 300)),
      height: Math.max(24, Math.min(initialBoxSize.current.height + deltaY, 200))
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
    handleResizeTextBox({
      width: Math.max(60, Math.min(initialBoxSize.current.width + deltaX, 300)),
      height: Math.max(24, Math.min(initialBoxSize.current.height + deltaY, 200))
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
      {isQuoteBubble && emojiText &&(
        <svg
          width={textBoxSize.width + 48}
          height={textBoxSize.height + 48}
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
            width={textBoxSize.width}
            height={textBoxSize.height}
            rx="18"
            ry="18"
            fill="lightgray"
            stroke="#333"
            strokeWidth="3"
          />
        <polygon
          points={(() => {
            // Find which edge the base is on
            let base1, base2;
            const offset = 12;
            if (tailBase.y === 0) { // top
              base1 = [tailBase.x - offset + 24, tailBase.y + 24];
              base2 = [tailBase.x + offset + 24, tailBase.y + 24];
            } else if (tailBase.y === textBoxSize.height) { // bottom
              base1 = [tailBase.x - offset + 24, tailBase.y + 24];
              base2 = [tailBase.x + offset + 24, tailBase.y + 24];
            } else if (tailBase.x === 0) { // left
              base1 = [tailBase.x + 24, tailBase.y - offset + 24];
              base2 = [tailBase.x + 24, tailBase.y + offset + 24];
            } else if (tailBase.x === textBoxSize.width) { // right
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
      <div
        style={{
          position: 'absolute',
          left: tailBase.x - 20,
          top: tailBase.y - 20,
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
          const origX = tailBase.x;
          const origY = tailBase.y;
          const onMouseMove = moveEvent => {
            let newX = origX + (moveEvent.clientX - startX);
            let newY = origY + (moveEvent.clientY - startY);

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
          const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
          };
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        }}
      />
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