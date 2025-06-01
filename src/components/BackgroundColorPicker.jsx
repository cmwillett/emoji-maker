import React from 'react';

export default function BackgroundColorPicker({ backgroundColor, setBackgroundColor, keepOriginalBg, setKeepOriginalBg }) {
  const presetColors = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
    "#ffa500", "#800080", "#00ffff", "#ff69b4", "#ffd700", "#87ceeb"
  ];

  const row1 = presetColors.slice(0, Math.ceil(presetColors.length / 2));
  const row2 = presetColors.slice(Math.ceil(presetColors.length / 2));

  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <div className="mt-4 text-center">
        <label className="block text-emerald-400 font-semibold drop-shadow-md mb-2">
          Current Background
        </label>
        <div className="flex justify-center items-center h-8 mb-2">
          {keepOriginalBg ? (
            <span className="text-small text-white">Original Background</span>
          ) : backgroundColor ? (
            <span
              className="inline-block w-8 h-8 rounded border"
              style={{ backgroundColor: backgroundColor, borderColor: 'gray' }}
              title={backgroundColor}
            ></span>
          ) : (
            <span className="text-small text-white">Remove Background</span>
          )}
        </div>
        <p className="text-emerald-400 font-semibold drop-shadow-md mb-2">Background Colors</p>
        <div className="flex flex-col items-center justify-center mb-4 gap-2">
          <button
            className="text-xs rounded px-2 border cursor-pointer bg-white text-black border-white hover:bg-gray-200"
            onClick={() => setKeepOriginalBg(true)}
          >
            Keep Original Background
          </button>
          <button
            className="text-xs rounded px-2 border cursor-pointer bg-white text-black border-white hover:bg-gray-200"
            onClick={() => {
              setBackgroundColor('');
              setKeepOriginalBg(false);
            }}
          >
            Remove Background
          </button>
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex justify-center gap-2">
            {row1.map((color) => (
              <button
                key={color + '-1'}
                className="w-6 h-6 rounded-full border cursor-pointer"
                style={{ backgroundColor: color, borderColor: color === backgroundColor ? 'lime' : 'white' }}
                onClick={() => {
                  setBackgroundColor(color);
                  setKeepOriginalBg(false);
                }}
              ></button>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            {row2.map((color) => (
              <button
                key={color + '-2'}
                className="w-6 h-6 rounded-full border cursor-pointer"
                style={{ backgroundColor: color, borderColor: color === backgroundColor ? 'lime' : 'white' }}
                onClick={() => {
                  setBackgroundColor(color);
                  setKeepOriginalBg(false);
                }}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}