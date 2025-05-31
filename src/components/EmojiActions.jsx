import React from 'react';
import BackgroundColorPicker from './BackgroundColorPicker';
import StyleOptions from './StyleOptions';
import EmojiTextInput from './EmojiTextInput';

const presetTextColors = [
  "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
  "#ffa500", "#800080", "#00ffff", "#ff69b4", "#ffd700", "#87ceeb"
];

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
      <EmojiTextInput emojiText={emojiText} setEmojiText={setEmojiText} presetTextColors={presetTextColors} fontColor={fontColor} setFontColor={setFontColor}/>

      <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4 flex flex-col items-center gap-2">
        <button
          type="button"
          className="btn-primary cursor-pointer"
          onClick={onReset}
        >
          Start Over
        </button>
        <button
          type="button"
          className="btn-primary cursor-pointer"
          onClick={onCrop}
        >
          Preview Emoji/Meme
        </button>
      </div>
    </div>
  );
}