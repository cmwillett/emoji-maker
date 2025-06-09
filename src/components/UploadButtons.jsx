import { useState } from 'react';
import { Stack, Tooltip } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { EmojiButton } from './EmojiButton';
import heic2any from 'heic2any';
import { galleryImages } from '../constants/galleryImages'; // Assuming you have a list of common images
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { handleFileInput } from '../lib/imageUtils';
import GalleryGrid from './GalleryGrid';
import { readBlobAsDataURL } from '../lib/imageUtils';
import { panelBase } from '../lib/classNames';
import GalleryMemes from './GalleryMemes'; // <-- Add this import
import customBackgrounds from '../constants/customBackgrounds';
/**
 * UploadButtons provides UI for uploading, taking, or selecting a photo.
 *
 * @param {function} onImageSelect - Callback with the selected image as a data URL.
 */
export default function UploadButtons({ onImageSelect }) {
  const [showGallery, setShowGallery] = useState(false);
  const [showBackgrounds, setShowBackgrounds] = useState(false);

  const onFileInput= (e) => handleFileInput(e, onImageSelect);

  // Handle selecting a gallery image
  const handleGallerySelect = async (imgPath) => {
    const res = await fetch(imgPath);
    const blob = await res.blob();
    const dataUrl = await readBlobAsDataURL(blob);
    onImageSelect(dataUrl);
    setShowGallery(false);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  return (
    <div className={panelBase}>
      <Stack direction="column" spacing={1} className="mt-1 items-center mb-2">
        <h2 className="mt-0 block text-emerald-400 font-semibold drop-shadow-md mb-1 text-center underline">
          Step 1
        </h2>
        <p className="block text-emerald-400 font-semibold drop-shadow-md mb-2 text-center mt-1">
          Take or choose a photo
        </p>
        {/* Take Photo Button */}
        <Tooltip title="Use your device's camera to take a new photo..." placement="right">
          <div>
            <EmojiButton
              icon={<CameraAltIcon />}
              label={
                <>
                  Take Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={onFileInput}
                    className="hidden"
                  />
                </>
              }
              component="label"
            />
          </div>
        </Tooltip>
        {/* Choose from Gallery Button */}
        <Tooltip title="Choose an image from your gallery or file system..." placement="right">
          <div>
            <EmojiButton
              icon={<PhotoLibraryIcon />}
              label={
                <>
                  Choose from Gallery
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileInput}
                    className="hidden"
                  />
                </>
              }
              component="label"
            />
          </div>
        </Tooltip>
        {/* Choose from Common Memes Button */}
        <Tooltip title="Click to select a common image from our gallery" placement="right">
          <div>
            <EmojiButton
              icon={
                <ExpandMoreIcon
                  style={{
                    transition: 'transform 0.2s',
                    transform: showGallery ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              }
              label="Choose From Common Memes"
              onClick={() => setShowGallery((prev) => !prev)}
              type="button"
            />
          </div>
        </Tooltip>
        <Tooltip title="Pick a background image (no photo needed)" placement="right">
          <div>
            <EmojiButton
              icon={
                <ExpandMoreIcon
                  style={{
                    transition: 'transform 0.2s',
                    transform: showBackgrounds ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              }
              label="JUST A BACKGROUND"
              onClick={() => setShowBackgrounds((prev) => !prev)}
              type="button"
            />
          </div>
        </Tooltip>        
      </Stack>
      {/* Gallery grid */}
      {showGallery && (
        <GalleryMemes onSelect={img => handleGallerySelect(img.src)} />
      )}
      {showBackgrounds && (
        <div className="my-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center w-full max-w-lg mx-auto">
            {customBackgrounds.map((bg, idx) => (
              <div
                key={bg.img + idx}
                className="flex flex-col items-center w-full max-w-[110px]"
              >
                <div
                  className="cursor-pointer rounded shadow hover:scale-105 transition w-full"
                  onClick={async () => {
                    // Fetch the image and convert to data URL for onImageSelect
                    const res = await fetch(bg.img);
                    const blob = await res.blob();
                    const dataUrl = await readBlobAsDataURL(blob);
                    onImageSelect(dataUrl);
                    setShowBackgrounds(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: `url(${bg.img}) center/cover no-repeat`,
                    height: 80,
                    width: '100%',
                    border: '2px solid #34d399'
                  }}
                  title={bg.title}
                />
                <span className="mt-1 text-xs text-center text-white break-words w-full">{bg.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}      
    </div>
  );
}