import { React, useState } from 'react';
import { Stack, Tooltip } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { EmojiButton } from './EmojiButton';
import heic2any from 'heic2any';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { galleryImages } from '../constants/galleryImages'; // Assuming you have a list of common images
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function UploadButtons({ onImageSelect }) {
  const [showGallery, setShowGallery] = useState(false);
  const handleFileInput = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a HEIC image
    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/png",
        });

        // Convert Blob to Data URL
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            onImageSelect(reader.result);
          }
        };
        reader.readAsDataURL(convertedBlob);
      } catch (error) {
        console.error("HEIC conversion failed:", error);
        alert("Failed to process HEIC image. Please try another format.");
      }
    } else {
      // Regular image handling
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySelect = (imgPath) => {
    fetch(imgPath)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            onImageSelect(reader.result);
            setShowGallery(false);
          }
        };
        reader.readAsDataURL(blob);
      });
  };

  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-2 mb-2">
      <Stack direction="column" spacing={1} className="mt-1 items-center mb-2">
        <h2 className="mt-0 block text-emerald-400 font-semibold drop-shadow-md mb-1 text-center underline">
          Step 1
        </h2>
        <p className="block text-emerald-400 font-semibold drop-shadow-md mb-2 text-center mt-1">
          Take or choose a photo
        </p>
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
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </>
              }
              component="label"
            />
          </div>
        </Tooltip>

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
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </>
              }
              component="label"
            />
          </div>
        </Tooltip>
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
      {showGallery && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {galleryImages.map((img, idx) => (
            <Tooltip 
            key={img.src + idx} 
            title={img.label} 
            arrow
            placement="bottom"
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: '1.1rem',
                  padding: '10px 16px',
                  backgroundColor: '#34d399', // emerald-400
                  color: '#1e293b',           // slate-800 for contrast
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  boxShadow: 3,
                },
              },
              arrow: {
                sx: {
                  color: '#34d399', // emerald-400
                }
              }
            }}       
            >
              <img
                src={img.src.startsWith('/') ? img.src : '/' + img.src}
                alt={img.label}
                className="w-full h-48 object-contain bg-gray-900 rounded shadow cursor-pointer hover:scale-105 transition"
                onClick={() => handleGallerySelect(img.src)}
                style={{ display: 'block' }}
              />
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}