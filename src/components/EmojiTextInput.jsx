import React from 'react';
import { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useRef } from 'react';
import { panelBase } from '../lib/classNames';

export default function EmojiTextInput({ emojiText, setEmojiText, fontColor, setFontColor, fontSize, setFontSize, isBold, setIsBold, isQuoteBubble, setIsQuoteBubble, presetTextColors }) {
  const row1 = presetTextColors.slice(0, Math.ceil(presetTextColors.length / 2));
  const row2 = presetTextColors.slice(Math.ceil(presetTextColors.length / 2));
  const [showInfo, setShowInfo] = React.useState(false);  
  // Add a state to control picker visibility
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiTextRef = useRef(null);

// Add a handler to insert emoji into your emojiText
const handleEmojiSelect = (emoji) => {
  const input = emojiTextRef.current;
  if (input) {
    // Insert at cursor position
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newValue =
      emojiText.slice(0, start) + emoji.native + emojiText.slice(end);
    setEmojiText(newValue);

    setShowEmojiPicker(false);

    // Focus and move cursor after emoji
    setTimeout(() => {
      input.focus();
      const pos = start + emoji.native.length;
      input.setSelectionRange(pos, pos);
    }, 0);
  } else {
    // fallback: just append
    setEmojiText(emojiText + emoji.native);
    setShowEmojiPicker(false);
  }
};

  return (
    <div className={`${panelBase} rounded-lg p-4 mb-4`}>
      <h2 className="text-center block text-emerald-400 font-semibold drop-shadow-md mb-2 underline mt-0">
        Text Options
      </h2>
      <div className="flex justify-center mb-2">
        <button
          className="text-xs px-2 py-1 rounded bg-yellow-400 text-black hover:bg-yellow-500 border border-yellow-500 font-semibold flex items-center gap-1 shadow"
          onClick={() => setShowInfo(true)}
          type="button"
          aria-label="Show text options info"
        >
          <span role="img" aria-label="info">ℹ️</span> Click for Details
        </button>
      </div>     
      <div className="flex justify-center mb-2">
        <input
          ref={emojiTextRef}
          type="text"
          value={emojiText}
          onChange={(e) => setEmojiText(e.target.value)}
          placeholder="Add text here"
          className="p-1 border rounded text-center w-full max-w-xs mb-2"
        />
      </div>
      <div className="flex items-center gap-4 mb-2">
        <label className="flex items-center gap-1 text-emerald-400 text-sm">
          Size:
          <input
            type="range"
            min={12}
            max={64}
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="ml-2"
          />
          <input
            type="number"
            min={12}
            max={64}
            value={fontSize === '' ? '' : fontSize}
            onChange={e => {
              const val = e.target.value;
              if (val === '') {
                setFontSize('');
              } else {
                const num = Number(val);
                if (!isNaN(num)) setFontSize(num);
              }
            }}
            onBlur={e => {
              let num = Number(e.target.value);
              if (isNaN(num) || num < 12) num = 12;
              if (num > 64) num = 64;
              setFontSize(num);
            }}
            className="ml-2 w-16 px-1 py-0.5 rounded border border-emerald-400 bg-black/20 text-center text-emerald-400"
            aria-label="Font size"
          />
          <span className="ml-1">px</span>
        </label>
      </div>
      <div className="flex justify-center items-start gap-4 mb-2">
        <div className="flex flex-col gap-2">
          <label className="text-emerald-400 font-semibold drop-shadow-md">
            <input
              type="checkbox"
              checked={isBold}
              onChange={e => setIsBold(e.target.checked)}
              className="accent-emerald-500"
            />
            Bold
          </label>
          <label className="text-emerald-400 font-semibold drop-shadow-md">
            <input
              type="checkbox"
              checked={isQuoteBubble}
              onChange={e => setIsQuoteBubble(e.target.checked)}
              className="accent-emerald-500"
            />
            Quote Bubble
          </label>
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="rounded px-2 py-1 bg-emerald-400 text-black font-semibold hover:bg-emerald-500"
          >
            😊 Emoji
          </button>
          {showEmojiPicker && (
            <div
              style={{
                position: 'absolute',
                bottom: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                minWidth: 320,
                paddingTop: '0.5rem',
              }}
            >
              <button
                onClick={() => setShowEmojiPicker(false)}
                style={{
                  position: 'absolute',
                  top: '-1.2rem',
                  right: '-1.2rem',
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  fontSize: '1.5rem',
                  width: '2.2rem',
                  height: '2.2rem',
                  cursor: 'pointer',
                  color: '#888',
                  zIndex: 101,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                }}
                aria-label="Close emoji picker"
              >
                ×
              </button>
              <div style={{ position: 'relative' }}>
                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
              </div>
            </div>
          )}
        </div>
      </div>          
      {/* Text Color Picker */}
      <label className="flex flex-col items-center mb-2">
        <span className="text-emerald-400 font-semibold drop-shadow-md mb-2">
          Text Color (defaults to white):
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 justify-center mb-2">
            {row1.map((color) => (
              <button
                key={color + '-1'}
                className={`w-6 h-6 rounded-full border cursor-pointer transition
                  ${color === fontColor ? 'ring-4 ring-lime-400 border-lime-400 scale-110' : ''}`}
                style={{
                  backgroundColor: color,
                  borderColor: color === fontColor ? 'lime' : 'white'
                }}
                onClick={() => setFontColor(color)}
                aria-label={`Set text color to ${color}`}
              ></button>
            ))}
          </div>
          <div className="flex gap-2 justify-center">
            {row2.map((color) => (
              <button
                key={color + '-2'}
                className={`w-6 h-6 rounded-full border cursor-pointer transition
                  ${color === fontColor ? 'ring-4 ring-lime-400 border-lime-400 scale-110' : ''}`}
                style={{
                  backgroundColor: color,
                  borderColor: color === fontColor ? 'lime' : 'white'
                }}
                onClick={() => setFontColor(color)}
                aria-label={`Set text color to ${color}`}
              ></button>
            ))}
          </div>
        </div>
      </label>   
      {showInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg relative">
            <h3 className="text-lg font-bold mb-2 text-emerald-600">Text Options Info</h3>
            <ul className="list-disc ml-5 text-gray-800 text-sm">
              <li>Add your desired text in the input box.</li>
              <li>Pick a font color below if you want something other than white.</li>
              <li>Change the font size if you want <u><b>(must be between 12 - 64)</b></u></li>
              <li>Unselect Bold if you don't want bold text</li>
              <li>Select Quote Bubble if you'd like the text to appear as a quote</li>
              <ul>
                <li>The arrow on the quote bubble is draggable.</li>
                <li>Drag the arrow to position it around the speech bubble.</li>
              </ul>
              <li>Drag the textbox on the image to position your text.</li>
              <li>Resize the textbox by dragging the small handle in the bottom right corner.</li>
              <li>Your changes will be reflected in the final output.</li>
            </ul>
            <button
              className="mt-6 px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600 font-semibold w-full"
              onClick={() => setShowInfo(false)}
              aria-label="Close info modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}