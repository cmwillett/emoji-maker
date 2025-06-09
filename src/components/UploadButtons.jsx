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
/**
 * UploadButtons provides UI for uploading, taking, or selecting a photo.
 *
 * @param {function} onImageSelect - Callback with the selected image as a data URL.
 */
export default function UploadButtons({ onImageSelect }) {
  const [showGallery, setShowGallery] = useState(false);

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
      </Stack>
      {/* Gallery grid */}
      {showGallery && (
        <GalleryMemes onSelect={img => handleGallerySelect(img.src)} />
      )}
    </div>
  );
}