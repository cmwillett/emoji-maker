import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import customBackgrounds from '../constants/customBackgrounds';
import { EmojiButton } from './EmojiButton';
import { Tooltip } from '@mui/material';
import { useState } from 'react';

export default function BackgroundColorPicker({ backgroundColor, setBackgroundColor, keepOriginalBg, setKeepOriginalBg, backgroundType, setBackgroundType }) {
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  
  const presetColors = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
    "#ffa500", "#800080", "#00ffff", "#ff69b4", "#ffd700", "#87ceeb"
  ];

  const [showInfo, setShowInfo] = React.useState(false);
  const row1 = presetColors.slice(0, Math.ceil(presetColors.length / 2));
  const row2 = presetColors.slice(Math.ceil(presetColors.length / 2));
  const backgroundTypeMap = Object.fromEntries(
    customBackgrounds.map(bg => [bg.type, bg.title])
  );

  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-2">
      <div className="mt-1 text-center">
        <h2 className="block text-emerald-400 font-semibold drop-shadow-md mb-2 underline mt-0">
          Background Options
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
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-emerald-400 font-semibold drop-shadow-md mb-0">Current Choice =</span>
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
        <div className="flex flex-col items-center justify-center mb-4 gap-2">
          <Tooltip title="Click to keep the original background from the photo" placement="right">
            <span>
              <button
                className={`px-4 py-2 rounded font-semibold border transition
                  ${keepOriginalBg && !backgroundColor && !backgroundType
                    ? 'bg-white text-emerald-500 border-emerald-400'
                    : 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'}`}
                onClick={() => {
                  setKeepOriginalBg(true)
                  setBackgroundColor('');
                  setBackgroundType('');
                }}
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
                  ${!keepOriginalBg && !backgroundColor && !backgroundType
                    ? 'bg-white text-emerald-500 border-emerald-400'
                    : 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'}`}
                onClick={() => {
                  setBackgroundColor('');
                  setKeepOriginalBg(false);
                  setBackgroundType('');
                }}
                type="button"
              >
                Remove Background
              </button>
            </span>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex justify-center gap-2 mb-2">
            {row1.map((color) => (
              <button
                key={color + '-1'}
                className="w-6 h-6 rounded-full border cursor-pointer"
                style={{ backgroundColor: color, borderColor: color === backgroundColor ? 'lime' : 'white' }}
                onClick={() => {
                  setBackgroundColor(color);
                  setKeepOriginalBg(false);
                  setBackgroundType('color');
                }}
              ></button>
            ))}
          </div>
          <div className="flex justify-center gap-2 mb-2">
            {row2.map((color) => (
              <button
                key={color + '-2'}
                className="w-6 h-6 rounded-full border cursor-pointer"
                style={{ backgroundColor: color, borderColor: color === backgroundColor ? 'lime' : 'white' }}
                onClick={() => {
                  setBackgroundColor(color);
                  setKeepOriginalBg(false);
                  setBackgroundType('color');
                }}
              ></button>
            ))}
          </div>
        </div>
        <EmojiButton
          icon={
            <ExpandMoreIcon
              style={{
                transition: 'transform 0.2s',
                transform: showBackgrounds ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          }
          label="Choose From Custom Backgrounds"
          onClick={() => setShowBackgrounds((prev) => !prev)}
          type="button"
        />
      </div>
      {showBackgrounds && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
          {customBackgrounds.map((bg, idx) => (
            <Tooltip
              key={bg.img + idx}
              title={bg.title}
              arrow
              placement="bottom"
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: '1.1rem',
                    padding: '10px 16px',
                    backgroundColor: '#34d399',
                    color: '#1e293b',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    boxShadow: 3,
                  },
                },
                arrow: {
                  sx: {
                    color: '#34d399',
                  }
                }
              }}
            >
              <div
                className="cursor-pointer rounded shadow hover:scale-105 transition"
                onClick={() => {
                  setBackgroundType(bg.type);
                  setBackgroundColor('');
                  setKeepOriginalBg(false);
                }}
                style={{
                  background: `url(${bg.img}) center/cover no-repeat`,
                  height: 80,
                  border: '2px solid #34d399'
                }}
              />
            </Tooltip>
          ))}
        </div>
      )}     
      {showInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg relative">
            <h3 className="text-lg font-bold mb-2 text-emerald-600">Background Options Info</h3>
            <ul className="list-disc ml-5 text-gray-800 text-sm">
              <li>Choose <u><b>Keep Original Background</b></u> to use your photo as-is.</li>
              <li>Anything other than <u><b>Keep Original Background</b></u> will remove the background of the original photo when the <u><b>create emoji/meme button</b></u> is pressed.</li>
              <li>Select <u><b>Remove Background</b></u> to erase the background completely.</li>
              <li>Pick a <u><b>color</b></u> below to use a solid background.</li>
              <li>Or select an <u><b>image</b></u> to use a custom background image.</li>
              <li><u>Only one background option can be active at a time.</u></li>
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