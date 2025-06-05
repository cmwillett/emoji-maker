import React from 'react';
import { EmojiButton } from './EmojiButton';
import { Tooltip } from '@mui/material';
import { Stack } from '@mui/material';

export default function ResetCreatePanel({ onReset, onCreate }) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4 flex flex-col items-center gap-2">
      <Stack direction="column" spacing={1} className="mt-0 items-center">
      <h2 className="underline block text-emerald-400 font-semibold drop-shadow-md mb-0 text-center mt-0">
        Step 3
      </h2>
      <p className="block text-emerald-400 font-semibold drop-shadow-md mb-0 text-center mt-1">
        Create your emoji/meme
      </p>
      {/*<p className="block text-emerald-400 font-semibold drop-shadow-md mb-2 mt-1 text-center">
        Or reset and start over
      </p>*/}
      </Stack>
        {/*<Tooltip title="Reset all options and choose a new image!" placement="right">
          <span>
            <EmojiButton
              icon={<img src="/reset.png" alt="Reset" className="w-6 h-6" />}
              label="Start Over"
              onClick={onReset}
            />
          </span>
        </Tooltip>*/}
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