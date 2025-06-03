import React from 'react';
import { Tooltip } from '@mui/material';
import { EmojiButton } from './EmojiButton';
import { Stack } from '@mui/material';

export default function EmojiPreview({
  croppedImage,
  isRound,
  onShareMobile,
  onShareClipboard,
  onDownload
}) {
  if (!croppedImage) return null;

  return (
    <div className="bg-black/40 flex-col items-center border border-emerald-400 rounded-lg p-2 mb-4">
    <div className="mt-0 flex flex-col items-center space-y-2">
      <Stack direction="column" spacing={1} className="mt-0 items-center">
      <h2 className="underline text-emerald-400 font-semibold drop-shadow-md mb-0 text-center mt-0">
        Step 4
      </h2>
      <p className="text-emerald-400 font-semibold drop-shadow-md mb-2 mt-0 text-center">
        Share or download your photo!
      </p>
      </Stack>
      <div
        className={`w-32 h-32 flex items-center justify-center box-border
          ${isRound ? 'rounded-full' : 'rounded-lg'} 
          `}
      >
        <img
          src={croppedImage}
          alt=""
          className={`w-full h-full object-cover ${isRound ? 'rounded-full' : 'rounded-lg'}`}
        />
      </div>
      <div className="flex flex-col items-center gap-2 mt-4">
        <Tooltip title="Click to share on a mobile device" placement="right">
          <span>
            <EmojiButton
              label="📤 Share (mobile)"
              onClick={onShareMobile}
            />
          </span>
        </Tooltip>        
        <Tooltip title="Click to share on a non-mobile device" placement="right">
          <span>
            <EmojiButton
              label="📋 Share (non-mobile)"
              onClick={onShareClipboard}
            />
          </span>
        </Tooltip>  
        <Tooltip title="Click to download to your device" placement="right">
          <span>
            <EmojiButton
              label="⬇️ Download"
              onClick={onDownload}
            />
          </span>
        </Tooltip>  
      </div>
    </div>
    </div>
  );
}