import React from 'react';
import BackgroundColorPicker from './BackgroundColorPicker';
import StyleOptions from './StyleOptions';
import EmojiTextInput from './EmojiTextInput';

const presetTextColors = [
  "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
  "#ffa500", "#800080", "#00ffff", "#ff69b4", "#ffd700", "#87ceeb"
];

const row1 = presetTextColors.slice(0, Math.ceil(presetTextColors.length / 2));
const row2 = presetTextColors.slice(Math.ceil(presetTextColors.length / 2));

export default function EmojiActions({
  backgroundColor,
  setBackgroundColor,
  isRound,
  setIsRound,
  emojiText,
  setEmojiText,
  fontColor,
  setFontColor,
  onCrop,
  onReset,
}) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <BackgroundColorPicker
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
      />
      <StyleOptions
        isRound={isRound}
        setIsRound={setIsRound}
      />
      <EmojiTextInput emojiText={emojiText} setEmojiText={setEmojiText} />
        <label className="flex flex-col items-center mb-2">
          <span className="text-emerald-400 font-semibold drop-shadow-md mb-2">
            Text Color (defaults to white):
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 justify-center">
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
      <button
        type="button"
        className="btn-primary mt-4 cursor-pointer"
        onClick={onCrop}
      >
        Preview Emoji/Meme
      </button>
      <button
        type="button"
        className="btn-primary mt-4 cursor-pointer"
        onClick={onReset}
      >
        Start Over
      </button>
    </div>
  );
}