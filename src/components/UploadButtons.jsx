import { React, useState } from 'react';
import { Stack, Tooltip } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { EmojiButton } from './EmojiButton';
import heic2any from 'heic2any';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { galleryImages } from '../constants/galleryImages'; // Assuming you have a list of common images

export default function UploadButtons({ onImageSelect }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
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
    // Convert image to data URL
    fetch(imgPath)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            onImageSelect(reader.result);
            setGalleryOpen(false);
          }
        };
        reader.readAsDataURL(blob);
      });
  };  

  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <Stack direction="column" spacing={2} className="mt-4 items-center">
        <h2 className="underline block text-emerald-400 font-semibold drop-shadow-md mb-2">
          Get Started
        </h2>
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
        <Tooltip title="Choose from some common memes..." placement="right">
          <div>
            <EmojiButton
              icon={<PhotoLibraryIcon />}
              label="Choose from Common Memes"
              onClick={() => setGalleryOpen(true)}
            />
          </div>
        </Tooltip>       
      </Stack>
      <Modal open={galleryOpen} onClose={() => setGalleryOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}>
          <h3>Choose an Image</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery ${idx}`}
                style={{ width: 100, height: 100, objectFit: 'cover', cursor: 'pointer', borderRadius: 8 }}
                onClick={() => handleGallerySelect(img)}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className="mt-4 rounded px-4 py-2 bg-emerald-400 text-black font-semibold hover:bg-emerald-500"
              onClick={() => setGalleryOpen(false)}
              type="button"
            >
              Cancel
            </button>     
          </div>     
        </Box>
      </Modal>      
    </div>
  );
}