import { getWrappedLines } from '../utils/utils';

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