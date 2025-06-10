import React, { useRef, useState } from 'react';

const steps = [
  {
    title: "Welcome to Emoji Creator!",
    content: (
      <>
        <p className="mb-2">This quick walkthrough will show you how to create your own emoji or meme from any photo or background.</p>
        <ul className="list-disc ml-5 text-sm text-gray-700">
          <li>Upload or take a photo, or start with a common meme image.</li>
          <li>Add text or quote bubble.</li>
          <li>Download, share, or copy your creation!</li>
        </ul>
      </>
    ),
  },
  {
    title: "Step 1: Upload or Take a Photo",
    content: (
      <>
        <ul>
            <li>Click the <b>Take Photo</b> button to use your camera.</li>
            <li>Click the <b>Gallery/File System</b> button to upload an image from your device.</li>
            <li>Or start with a <b>Common Meme Image</b></li>
        </ul>
      </>
    ),
  },
  {
    title: "Step 2a: Position and Zoom",
    content: (
      <>
        <ul>
            <li>Drag the image in the box up top to position it how you want it.</li>
            <li>Use the zoom slider to zoom in or out.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Step 2b: Customize Background & Text",
    content: (
      <>
        <p className="mb-2">Use the <b>Background</b> and <b>Text</b> tabs to:</p>
        <ul className="list-disc ml-5 text-sm text-gray-700">
          <li>Pick a background color or image</li>
          <li>Add and style your text (color, size, bold, quote bubble)</li>
        </ul>
      </>
    ),
  },
  {
    title: "Step 3: Create Your Emoji/Meme",
    content: (
      <>
        <p className="mb-2">When you're happy, click <b>Create</b> to generate your emoji/meme.</p>
      </>
    ),
  },
  {
    title: "Step 4: Download or Share",
    content: (
      <>
        <p className="mb-2">Click the appropriate share button or download it!</p>
      </>
    ),
  },  
  {
    title: "Need Help?",
    content: (
      <>
        <p className="mb-2">You can always click the <b>How To</b> button in the bottom left for help, or use the <b>About</b> and <b>Contact</b> links in the footer.</p>
        <p className="mb-2">Have fun creating!</p>
      </>
    ),
  },
];

    export default function WalkthroughModal({ open, onClose }) {
    const [step, setStep] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 80, y: 80 }); // initial position
    const modalRef = useRef(null);

    // Touch drag handlers for mobile
    const handleTouchStart = (e) => {
    if (!modalRef.current) return;
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
    });
    };

    React.useEffect(() => {
    if (!dragging) return;
    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        setPosition({
        x: touch.clientX - offset.x,
        y: touch.clientY - offset.y,
        });
    };
    const handleTouchEnd = () => setDragging(false);

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
    };
    }, [dragging, offset]);

  React.useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Drag handlers
  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.preventDefault();
  };

  React.useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };
    const handleMouseUp = () => setDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint

  if (!open) return null;

return (
  <div className="pointer-events-none">
    <div
    ref={modalRef}
    className={`bg-white rounded-lg p-6 max-w-md w-full shadow-lg fixed z-50 pointer-events-auto ${isMobile ? '' : 'cursor-grab'}`}
    style={{
        left: position.x,
        top: position.y,
        minWidth: isMobile ? 0 : 320,
        width: isMobile ? '95vw' : undefined,
        maxWidth: 400,
        transform: 'none',
    }}
    >
{/* Drag handle (mouse and touch) */}
<div
  className={`flex flex-col mb-2 ${isMobile ? '' : 'cursor-grab active:cursor-grabbing'}`}
  onMouseDown={isMobile ? undefined : handleMouseDown}
  onTouchStart={handleTouchStart}
  style={{ userSelect: 'none', touchAction: 'none' }}
>
  <span className="text-xs text-gray-400 mb-1 select-none self-center">
    {isMobile ? '👉 Drag this window out of the way' : '🖱️ Drag this window out of the way'}
  </span>
  <div className="flex items-center justify-between w-full">
    <h3 className="text-lg font-bold text-emerald-600">{steps[step].title}</h3>
    <button
      className="text-gray-400 hover:text-gray-700 text-2xl ml-2"
      onClick={onClose}
      aria-label="Close walkthrough"
      tabIndex={0}
    >
      ×
    </button>
  </div>
  </div>
      <div className="mb-4">{steps[step].content}</div>
      <div className="flex justify-between">
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            className="px-4 py-2 rounded bg-emerald-500 text-white font-semibold"
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          >
            Next
          </button>
        ) : (
          <button
            className="px-4 py-2 rounded bg-emerald-500 text-white font-semibold"
            onClick={onClose}
          >
            Finish
          </button>
        )}
      </div>
    </div>
  </div>
);
}    