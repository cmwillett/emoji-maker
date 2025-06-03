import React from 'react';

export default function EmojiTextInput({ emojiText, setEmojiText, fontColor, setFontColor, presetTextColors }) {
  const row1 = presetTextColors.slice(0, Math.ceil(presetTextColors.length / 2));
  const row2 = presetTextColors.slice(Math.ceil(presetTextColors.length / 2));

  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <h2 className="text-center block text-emerald-400 font-semibold drop-shadow-md mb-2 underline mt-0">
        Text Options
      </h2>
      <p className="text-emerald-400 font-semibold drop-shadow-md mb-2 text-center">Add Text?</p>
      <div className="flex justify-center mb-2">
        <input
          type="text"
          value={emojiText}
          onChange={(e) => setEmojiText(e.target.value)}
          placeholder="Add text here"
          className="p-1 border rounded text-center w-full max-w-xs mb-2"
        />
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
                className="w-6 h-6 rounded-full border cursor-pointer"
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
                className="w-6 h-6 rounded-full border cursor-pointer"
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
    </div>
  );
}