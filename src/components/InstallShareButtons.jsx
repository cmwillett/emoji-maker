import React from 'react';
import { Stack, Tooltip } from '@mui/material';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import ShareIcon from '@mui/icons-material/Share';
import { EmojiButton } from './EmojiButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

export default function InstallShareButtons({ showInstall, handleInstallClick }) {
  const [howToOpen, setHowToOpen] = React.useState(false);
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <div>
        <h2 className="underline text-center block text-emerald-400 font-semibold drop-shadow-md mb-2">
          {showInstall ? "Install/Share/How To" : "Share/How To"}
        </h2>
      </div>
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
          <Tooltip title="Click this to learn how to use this app!" placement="right">
            <span>
              <EmojiButton
                icon={<ShareIcon />}
                label="How To"
                onClick={() => setHowToOpen(true)}
              />
            </span>
          </Tooltip>        
      </Stack>
      <Modal open={howToOpen} onClose={() => setHowToOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
          minWidth: 300, maxWidth: 500
        }}>
          <h2>How To Use This App</h2>
          <ul style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
            <li>Upload or take a photo to get started.</li>
            <li>Crop and adjust your image as needed.</li>
            <li>Pick a background color or pattern.</li>
            <li>Add emoji text and customize the font color.</li>
            <li>Click "Create Emoji/Meme" to generate your image.</li>
            <li>Download or share your creation!</li>
          </ul>
          <button
            className="rounded px-4 py-2 bg-emerald-400 text-black font-semibold hover:bg-emerald-500 mt-2"
            onClick={() => setHowToOpen(false)}
          >
            Close
          </button>
        </Box>
      </Modal>             
    </div>
  ); 
}