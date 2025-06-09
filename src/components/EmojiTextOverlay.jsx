import { getWrappedLines } from '../utils/utils';

/**
 * EmojiTextOverlay renders the emoji/meme text over the preview image.
 * Handles line wrapping and styling for the overlay text.
 *
 * @param {string} emojiText - The text to display.
 * @param {CanvasRenderingContext2D} previewCtx - The canvas context for measuring text width.
 * @param {number} cropperDiameter - The diameter/width of the cropper area.
 * @param {string} fontColor - The color of the overlay text.
 */
export default function EmojiTextOverlay({ emojiText, previewCtx, cropperDiameter, fontColor }) {
  if (!emojiText) return null;
  return (
    <div
      className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center"
      style={{
        transform: 'translate(-50%, -37%)',
        width: '65%',
        maxWidth: '65%',
        height: '100%',
        color: fontColor,
        textShadow: '2px 2px 4px #000',
        fontWeight: 'bold',
        fontSize: `calc(${cropperDiameter}px / 12)`,
        lineHeight: 1.2,
        pointerEvents: 'none',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        zIndex: 10,
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Render each wrapped line as a separate span */}
      {getWrappedLines(
        previewCtx,
        emojiText,
        cropperDiameter * 0.65
      ).map((line, i) => (
        <span key={i}>{line.trim()}</span>
      ))}
    </div>
  );
}