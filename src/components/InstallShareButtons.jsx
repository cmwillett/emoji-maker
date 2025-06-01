import React from 'react';
import { Stack, Tooltip } from '@mui/material';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import ShareIcon from '@mui/icons-material/Share';
import { EmojiButton } from './EmojiButton';

export default function InstallShareButtons({ showInstall, handleInstallClick }) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <Stack direction="row" spacing={2} className="mt-4">
        {showInstall && (
          <div>
            <label className="block text-emerald-400 font-semibold drop-shadow-md mb-2">
              About/Contact
            </label>
            <Tooltip
              title="Install this app to your home screen/desktop/taskbar for quick access!"
              placement="left"
            >
              <span>
                <EmojiButton
                  icon={<InstallMobileIcon />}
                  label="Install App"
                  onClick={handleInstallClick}
                />
              </span>
            </Tooltip>
          </div>
        )}
      </Stack>
    </div>
  );
}