import React from 'react';
import { customBackgrounds } from '../constants/customBackgrounds';
import { EmojiButton } from './EmojiButton';
import { Tooltip } from '@mui/material';

export default function BackgroundColorPicker({ backgroundColor, setBackgroundColor, keepOriginalBg, setKeepOriginalBg, backgroundType, setBackgroundType }) {
  const presetColors = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
    "#ffa500", "#800080", "#00ffff", "#ff69b4", "#ffd700", "#87ceeb"
  ];

  const row1 = presetColors.slice(0, Math.ceil(presetColors.length / 2));
  const row2 = presetColors.slice(Math.ceil(presetColors.length / 2));
  const backgroundTypeMap = Object.fromEntries(
    customBackgrounds.map(bg => [bg.type, bg.title])
  );

  function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <div className="mt-4 text-center">
        <h2 className="block text-emerald-400 font-semibold drop-shadow-md mb-2 underline">
          Background Options
        </h2>

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-emerald-400 font-semibold drop-shadow-md">Selected =</span>
          {keepOriginalBg ? (
            <span className="text-sm text-white">Use Original</span>
          ) : backgroundType && backgroundTypeMap[backgroundType] ? (
            <span className="text-sm text-white">{backgroundTypeMap[backgroundType]}</span>
          ) : backgroundColor ? (
            <span
              className="inline-block w-8 h-8 rounded border"
              style={{ backgroundColor: backgroundColor, borderColor: 'gray' }}
              title={backgroundColor}
            ></span>
          ) : (
            <span className="text-sm text-white">Remove</span>
          )}
        </div>

        <p className="text-emerald-400 font-semibold drop-shadow-md mb-2">Background Colors</p>
        <div className="flex flex-col items-center justify-center mb-4 gap-2">
          <Tooltip title="Click to keep the original background from the photo" placement="right">
            <span>
              <button
                className={`px-4 py-2 rounded font-semibold border transition
                  ${keepOriginalBg
                    ? 'bg-white text-emerald-500 border-emerald-400'
                    : 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'}`}
                onClick={() => setKeepOriginalBg(true)}
                type="button"
              >
                Keep Original Background
              </button>
            </span>
          </Tooltip>
          <Tooltip title="Click to remove the background entirely from the photo" placement="right">
            <span>
              <button
                className={`px-4 py-2 rounded font-semibold border transition
                  ${!keepOriginalBg && !backgroundColor
                    ? 'bg-white text-emerald-500 border-emerald-400'
                    : 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'}`}
                onClick={() => {
                  setBackgroundColor('');
                  setKeepOriginalBg(false);
                }}
                type="button"
              >
                Remove Background
              </button>
            </span>
          </Tooltip>
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
          {chunkArray(customBackgrounds, 5).map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center mb-4 gap-2">
              {row.map(bg => (
                <button
                  key={bg.type}
                  className="w-15 h-10 text-xs rounded px-2 border cursor-pointer bg-white text-black border-white hover:bg-gray-200"
                  style={{
                    backgroundImage: `url('${bg.img}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onClick={() => { 
                    setBackgroundType(bg.type)
                    setKeepOriginalBg(false);
                  }}
                  title={bg.title}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}