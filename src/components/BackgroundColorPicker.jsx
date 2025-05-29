import React from 'react';

export default function BackgroundColorPicker({ backgroundColor, setBackgroundColor }) {
  const presetColors = ["#ffffff", "#ffd700", "#87ceeb", "#ff69b4", "#000000"];

  return (
    <div className="mt-4 text-center">
      <p className="text-emerald-400 font-semibold drop-shadow-md mb-2">Choose Background Color</p>
      <div className="text-emerald-400 text-sm text-left mb-2">
        <ul className="list-disc list-inside space-y-1">
          <li>Do nothing if you want to just remove the background...</li>
          <li>Choose a color if you want to use that color as your background...</li>
          <li>Click the "No BG" button if you want to go back to removing the background...</li>
          <li>Click the bottom square to create a custom color for your background...</li>
        </ul>
      </div>
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
      <label className="block text-sm text-emerald-400 font-medium mb-1">
        Pick a Custom Background Color
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