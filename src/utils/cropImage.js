/**
 * Crops an image to the specified pixel area and returns either a Blob or an Object URL.
 * @param {string} imageSrc - Source URL or data URI of the image to crop.
 * @param {Object} pixelCrop - Crop area with { x, y, width, height } in pixels.
 * @param {string} mimeType - Output image MIME type (default: 'image/png').
 * @param {boolean} returnBlob - If true, resolves with a Blob; otherwise, resolves with an Object URL.
 * @returns {Promise<Blob|string>} - Resolves with the cropped image as a Blob or Object URL.
 */
export default function getCroppedImg(imageSrc, pixelCrop, mimeType = 'image/png', returnBlob = false) {
  return new Promise((resolve, reject) => {
    // Create an HTMLImageElement to load the source image
    const image = new Image();
    image.crossOrigin = 'anonymous'; // Allow cross-origin images
    image.src = imageSrc;

    // When the image loads, crop it using a canvas
    image.onload = () => {
      // Create a canvas with the size of the crop area
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      // Draw the cropped area of the image onto the canvas
      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, // Source crop rectangle
        0, 0, pixelCrop.width, pixelCrop.height                      // Destination on canvas
      );

      // Convert the canvas to a Blob (or Object URL)
      canvas.toBlob(
        (blob) => {
          console.log('Canvas width:', canvas.width, 'height:', canvas.height);
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          if (returnBlob) {
            resolve(blob); // Return the Blob directly
          } else {
            const url = URL.createObjectURL(blob); // Create a URL for the Blob
            resolve(url);
          }
        },
        mimeType,
        1 // Quality (for JPEG/WebP; ignored for PNG)
      );
    };

    // Handle image loading errors
    image.onerror = (error) => reject(error);
  });
}