import React from 'react';

export default function BackgroundColorPicker({ backgroundColor, setBackgroundColor }) {
  const presetColors = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
    "#ffa500", "#800080", "#00ffff", "#ff69b4", "#ffd700", "#87ceeb"
  ];

  const row1 = presetColors.slice(0, Math.ceil(presetColors.length / 2));
  const row2 = presetColors.slice(Math.ceil(presetColors.length / 2));

  return (
    <div className="mt-4 text-center">
      <label className="block text-emerald-400 font-semibold drop-shadow-md mb-2">
        Current Background
      </label>
      <div className="flex justify-center items-center h-8">
        {backgroundColor ? (
          <span
            className="inline-block w-8 h-8 rounded border"
            style={{ backgroundColor: backgroundColor, borderColor: 'gray' }}
            title={backgroundColor}
          ></span>
        ) : (
          <span className="text-small text-white">No Background</span>
        )}
      </div>
      <p className="text-emerald-400 font-semibold drop-shadow-md mb-2">Background Colors</p>
      
      {/* Centered No BG button above presets */}
      <div className="flex justify-center mb-2">
        <button
          className="text-xs text-black bg-white border border-white rounded px-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => setBackgroundColor('')}
        >
          No Background
        </button>
      </div>

      <div className="flex flex-col gap-1 mb-2">
        <div className="flex justify-center gap-2">
          {row1.map((color) => (
            <button
              key={color + '-1'}
              className="w-6 h-6 rounded-full border cursor-pointer"
              style={{ backgroundColor: color, borderColor: color === backgroundColor ? 'lime' : 'white' }}
              onClick={() => setBackgroundColor(color)}
            ></button>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {row2.map((color) => (
            <button
              key={color + '-2'}
              className="w-6 h-6 rounded-full border cursor-pointer"
              style={{ backgroundColor: color, borderColor: color === backgroundColor ? 'lime' : 'white' }}
              onClick={() => setBackgroundColor(color)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}