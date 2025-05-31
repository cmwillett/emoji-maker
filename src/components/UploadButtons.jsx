import React from 'react';
import { Stack, Tooltip } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { EmojiButton } from './EmojiButton';
import heic2any from 'heic2any';

export default function UploadButtons({ onImageSelect }) {
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

  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <Stack direction="column" spacing={2} className="mt-4 items-center">
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
      </Stack>
    </div>
  );
}