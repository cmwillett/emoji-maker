import React from 'react';

export default function BackgroundColorPicker({ backgroundColor, setBackgroundColor }) {
  const presetColors = ["#ffffff", "#ffd700", "#87ceeb", "#ff69b4", "#000000"];

  return (
    <div className="mt-4 text-center">
      <p className="text-emerald-400 font-semibold drop-shadow-md mb-2">Choose Background Color</p>
      <div className="flex justify-center gap-2 mb-2">
        {presetColors.map((color) => (
          <button
            key={color}
            className="w-6 h-6 rounded-full border cursor-pointer"
            style={{ backgroundColor: color, borderColor: color === backgroundColor ? 'lime' : 'white' }}
            onClick={() => setBackgroundColor(color)}
          ></button>
        ))}
        <button
          className="text-xs text-black bg-white border border-white rounded px-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => setBackgroundColor('')}
        >
          No BG
        </button>
      </div>
      <label className="block text-emerald-400 font-semibold drop-shadow-md mb-2">
        Current Color (Click for Custom)
      </label>
      <input
        type="color"
        value={backgroundColor || '#ffffff'}
        onChange={(e) => setBackgroundColor(e.target.value)}
        className="cursor-pointer"
      />
    </div>
  );
}