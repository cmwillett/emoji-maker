import React from 'react';
import BackgroundColorPicker from './BackgroundColorPicker';
import StyleOptions from './StyleOptions';
import EmojiTextInput from './EmojiTextInput';

export default function EmojiActions({
  backgroundColor,
  setBackgroundColor,
  borderStyle,
  setBorderStyle,
  showShadow,
  setShowShadow,
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
        borderStyle={borderStyle}
        setBorderStyle={setBorderStyle}
        showShadow={showShadow}
        setShowShadow={setShowShadow}
        isRound={isRound}
        setIsRound={setIsRound}
      />
      <EmojiTextInput emojiText={emojiText} setEmojiText={setEmojiText} />
      <label className="flex flex-col items-center space-x-2 mb-2">
        <span className="text-emerald-400 font-semibold drop-shadow-md mb-2">
          Text Color (defaults to white):
        </span>
        <input
          type="color"
          value={fontColor}
          onChange={e => setFontColor(e.target.value)}
          className="w-8 h-8 p-0 border border-gray-400 rounded"
        />
      </label>
      <button
        type="button"
        className="btn-primary mt-4 cursor-pointer"
        onClick={onCrop}
      >
        Crop Image and Preview Emoji
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