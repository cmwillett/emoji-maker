import BackgroundColorPicker from './BackgroundColorPicker';
import StyleOptions from './StyleOptions';
import EmojiTextInput from './EmojiTextInput';
import { panelBase } from '../styles/panelStyles';

// Preset text color options for quick selection in EmojiTextInput
const presetTextColors = [
  "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
  "#ffa500", "#800080", "#00ffff", "#ff69b4", "#ffd700", "#87ceeb"
];

/**
 * EmojiActions component provides controls for customizing and creating an emoji/meme.
 * Includes background selection, style options, text input, and action buttons.
 * 
 * @param {object} props - All customization state and handlers from parent.
 */
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
  keepOriginalBg,
  setKeepOriginalBg
}) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Background selection (original, remove, color, or custom) */}
      <BackgroundColorPicker
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        keepOriginalBg={keepOriginalBg}
        setKeepOriginalBg={setKeepOriginalBg}
      />
      {/* Style options (e.g., round or square emoji) */}
      <StyleOptions
        isRound={isRound}
        setIsRound={setIsRound}
      />
      {/* Emoji text input and color selection */}
      <EmojiTextInput 
        emojiText={emojiText}
        setEmojiText={setEmojiText}
        presetTextColors={presetTextColors}
        fontColor={fontColor}
        setFontColor={setFontColor}
      />

      {/* Action buttons for reset and create */}
      <div className={`${panelBase} rounded-lg p-4 mb-4 flex flex-col items-center gap-2`}>
        {/* Reset all settings and start over */}
        <button
          type="button"
          className="btn-primary cursor-pointer"
          onClick={onReset}
        >
          Start Over
          (Reset everything)
        </button>
        {/* Create the emoji/meme with current settings */}
        <button
          type="button"
          className="btn-primary cursor-pointer"
          onClick={onCrop}
        >
          Create Emoji/Meme
        </button>
      </div>
    </div>
  );
}