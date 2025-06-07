import React from 'react';
import { Stack, Tooltip } from '@mui/material';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import ShareIcon from '@mui/icons-material/Share';
import { EmojiButton } from './EmojiButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

export default function InstallShareButtons({ showInstall, handleInstallClick }) {
  const [howToOpen, setHowToOpen] = React.useState(false);
  const howToContentRef = React.useRef(null);
  const [featuresOpen, setFeaturesOpen] = React.useState(false);
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <div>
        <h2 className="underline text-center block text-emerald-400 font-semibold drop-shadow-md mb-2 mt-0">
          {showInstall ? "Install/Share App/How To" : "Share App/How To"}
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
                icon={<img src="/howto.png" alt="Reset" className="w-6 h-6" />}
                label="How To"
                onClick={() => setHowToOpen(true)}
              />
            </span>
          </Tooltip>    
<Tooltip title="See what's new!" placement="right">
  <span>
    <EmojiButton
      icon={<img src="/features.png" alt="Features" className="w-6 h-6" />}
      label="Latest Features"
      onClick={() => setFeaturesOpen(true)}
    />
  </span>
</Tooltip>              
      </Stack>
      <Modal open={howToOpen} onClose={() => setHowToOpen(false)}>
        <Box
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
            minWidth: 300, maxWidth: 500,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
          <div ref={howToContentRef}>
          <h2>How To Use This App</h2>
          <ol style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
            <li>Take a photo, upload a photo, or choose a common photo to get started...</li>
              <ul style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
                <li>Click the "Take Photo", "Choose From Gallery", or "Choose From Common Images" button</li>
              </ul>
            <li>Edit the photo</li>
              <ul style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
                <li>Drag the photo to position it how you want</li>
                <li>Use the "Zoom Slider" to zoom in on the picture if desired</li>
                <li>Change the background however desired</li>
                  <ul style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
                    <li>Default is "Keep Original Background"</li>
                    <li>Click "Remove Background" if you want the background removed entirely</li>
                    <li>Choose a color from the palette if you want the background to be a solid color</li>
                    <li>Choose one of the custom backgrounds if you want an image as a background (bubbles, fire, etc)</li>
                    <li>If you want to update any styles, click the "Style" tab</li>
                      <ul style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
                        <li>Select "Circular Emoji" if you want it to be in a circle instead of a square</li>
                      </ul>
                    <li>If you want to add text, click the "Text" tab</li>
                      <ul style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
                        <li>Add whatever text you want in the input box</li>
                        <li>Change the font size if desired (default is 24)</li>
                        <li>Unselect Bold if you don't want the text to be bold</li>
                        <li>Select Quote Bubble if you want the text to appear as a quote</li>
                          <ul>
                            <li>The arrow on the quote bubble is draggable</li>
                            <li>So drag that wherever you want it to be around the speech bubble</li>
                          </ul>
                        <li>Choose a color from the palette if you don't want white text</li>
                        <li>Drag the textbox on the image to where you want it placed</li>
                        <li>Resize the textbox by clicking the handle in the bottom right corner of the textbox</li>
                      </ul>
                  </ul>
              </ul>
            <li>Click "Start Over" if you want to reset everything and start from scratch</li>
            <li>Click "Create Emoji/Meme" to create the image you desire...</li>
              <ul style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
                <li>Your image will display in a new "Preview" section below...</li>
              </ul>
            <li>Share or Download the final product</li>
              <ul style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
                <li>Click the "Share (mobile)" button if you're on a mobile device</li>
                <li>Click the "Share (non-mobile)" button if you're on a non-mobile device</li>
                <li>Click the "Download" button to save the image to your device</li>
              </ul>
          </ol>
            <button
              className="rounded px-4 py-2 bg-emerald-400 text-black font-semibold hover:bg-emerald-500"
              onClick={() => {
                if (!howToContentRef.current) return;
                const printContents = howToContentRef.current.innerHTML;
                const printWindow = window.open('', '', 'height=600,width=800');
                printWindow.document.write('<html><head><title>How To Use This App</title>');
                printWindow.document.write('<style>body{font-family:sans-serif;padding:2em;} ol,ul{margin-left:1.2em;}</style>');
                printWindow.document.write('</head><body >');
                printWindow.document.write(printContents);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
              }}
            >
              Print
            </button>
            <button
              className="rounded px-4 py-2 bg-emerald-400 text-black font-semibold hover:bg-emerald-500"
              onClick={() => setHowToOpen(false)}
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>       
      <Modal open={featuresOpen} onClose={() => setFeaturesOpen(false)}>
        <Box
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
            minWidth: 300, maxWidth: 500,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
          <h2>Latest Features</h2>
          <ul style={{ margin: '1em 0', paddingLeft: '1.2em' }}>
            <li>6/6/2025</li>
              <ul>
                <li>Resizable and draggable quote bubbles</li>
                <li>Draggable bubble tail/arrow</li>
              </ul>
            <li>Prior</li>
              <ul>
                <li>Added the ability to use custom backgrounds</li>
                <li>Added the ability to use a solid color as a background</li>
                <li>Added the ability to upload a photo from gallery/file system, common memes, or take a photo</li>
                <li>Added the ability to resize and move the photo</li>
                <li>Added the ability to keep the original background</li>                
                <li>Background removal</li>
                <li>Uploading a photo from gallery/file system, common memes, or taking a photo</li>
                <li>Ability to resize and move the photo</li>
                <li>Ability to keep the original background</li>
                <li>Ability to bold and resize text</li>
                <li>Ability to change text color</li>
                <li>Ability to add and resize a textbox</li>
                <li>And more!</li>
              </ul>
          </ul>
          <button
            className="rounded px-4 py-2 bg-emerald-400 text-black font-semibold hover:bg-emerald-500"
            onClick={() => setFeaturesOpen(false)}
          >
            Close
          </button>
        </Box>
      </Modal>          
    </div>
  ); 
}