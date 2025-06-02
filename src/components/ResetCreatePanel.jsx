import React from 'react';
import { EmojiButton } from './EmojiButton';
import { Tooltip } from '@mui/material';

export default function ResetCreatePanel({ onReset, onCreate }) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4 flex flex-col items-center gap-2">
      <h2 className="block text-emerald-400 font-semibold drop-shadow-md mb-2 underline">
        Reset/Create
      </h2>
        <Tooltip title="Reset all options and choose a new image!" placement="right">
          <span>
            <EmojiButton
              icon={<img src="/reset.png" alt="Reset" className="w-6 h-6" />}
              label="Start Over"
              onClick={onReset}
            />
          </span>
        </Tooltip>    
        <Tooltip title="Create the emoji/meme and display it below!" placement="right">
          <span>
            <EmojiButton
            icon={<img src="/create.png" alt="Create" className="w-6 h-6" />}
              label="Create Emoji/Meme"
              onClick={onCreate}
            />
          </span>
        </Tooltip>          
    </div>
  );
}