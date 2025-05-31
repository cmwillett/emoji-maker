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
        )}

        {navigator.share && (
          <Tooltip title="Share this app with others!" placement="right">
            <span>
              <EmojiButton
                icon={<ShareIcon />}
                label="Share App"
                onClick={() => {
                  navigator
                    .share({
                      title: "The Craig's Emoji Maker",
                      text: "Check out this fun emoji maker!",
                      url: window.location.href,
                    })
                    .catch(console.error);
                }}
              />
            </span>
          </Tooltip>
        )}
      </Stack>
    </div>
  );
}