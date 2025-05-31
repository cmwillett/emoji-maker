import React from 'react';

export default function EmojiPreview({
  croppedImage,
  isRound,
  borderStyle,
  showShadow,
  onShareMobile,
  onShareClipboard,
  onDownload
}) {
  if (!croppedImage) return null;
  console.log('isround:', isRound, 'borderStyle:', borderStyle, 'showShadow:', showShadow);

  return (
    <div className="mt-6 flex flex-col items-center space-y-2">
      <h2 className="text-emerald-400 font-semibold drop-shadow-md mb-2">Cropped Emoji/Meme Preview:</h2>
      <div
        className={`w-32 h-32 flex items-center justify-center box-border
          ${isRound ? 'rounded-full' : 'rounded-lg'} 
          ${borderStyle === 'solid' ? 'border-4 border-white' : ''} 
          ${showShadow ? 'shadow-lg' : ''}`}
      >
        <img
          src={croppedImage}
          alt=""
          className={`w-full h-full object-cover ${isRound ? 'rounded-full' : 'rounded-lg'}`}
        />
      </div>
      <div className="flex flex-col items-center gap-2 mt-4">
        <button className="btn-primary cursor-pointer" onClick={onShareMobile}>
          📤 Share (mobile)
        </button>
        <button className="btn-primary cursor-pointer" onClick={onShareClipboard}>
          📋 Share (non-mobile)
        </button>
        <button className="btn-primary cursor-pointer" onClick={onDownload}>
          ⬇️ Download
        </button>
      </div>
    </div>
  );
}