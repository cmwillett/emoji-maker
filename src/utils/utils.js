/**
 * Applies a solid background color behind a transparent image blob.
 * @param {Blob} transparentBlob - The image blob with transparency (e.g., after background removal).
 * @param {string} backgroundColor - The CSS color to use as the new background.
 * @returns {Promise<Blob>} - Resolves with a PNG blob with the color applied behind the image.
 */
export const applyBackgroundColor = async (transparentBlob, backgroundColor) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Create a canvas matching the image size
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      // Fill the canvas with the background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw the transparent image on top
      ctx.drawImage(img, 0, 0);
      // Export the result as a PNG blob
      canvas.toBlob((finalBlob) => {
        resolve(finalBlob);
      }, 'image/png');
    };
    // Load the blob as an image
    img.src = URL.createObjectURL(transparentBlob);
  });
};

/**
 * Calls the backend API to increment the emoji/meme creation counter.
 * Updates the emoji count in state.
 * @param {Function} setEmojiCount - React state setter for emoji count.
 */
export const incrementEmojiCount = async (setEmojiCount) => {
  try {
    const res = await fetch('/api/increment-emoji-count');
    const data = await res.json();
    setEmojiCount(data.count);
    console.log('Total Emojis Created:', data.count);
  } catch (err) {
    console.error('Failed to update emoji count', err);
  }
};

/**
 * Fetches the current emoji/meme creation count from the backend API.
 * Updates the emoji count in state.
 * @param {Function} setEmojiCount - React state setter for emoji count.
 */
export const fetchEmojiCount = async (setEmojiCount) => {
  try {
    const res = await fetch('/api/getEmojiCount');
    const data = await res.json();
    setEmojiCount(data.count);
  } catch (err) {
    console.error('Failed to fetch emoji count', err);
  }
};

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
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = imageSrc

    image.onload = () => {
      // Create a canvas with the size of the crop area
      const canvas = document.createElement('canvas')
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext('2d')

      // Draw the cropped area of the image onto the canvas
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      // Convert the canvas to a Blob (or Object URL)
      canvas.toBlob(
        (blob) => {
          console.log('Canvas width:', canvas.width, 'height:', canvas.height)
          if (!blob) {
            reject(new Error('Canvas is empty'))
            return
          }
          if (returnBlob) {
            resolve(blob)
          } else {
            const url = URL.createObjectURL(blob)
            resolve(url)
          }
        },
        mimeType,
        1
      )
    }

    // Handle image loading errors
    image.onerror = (error) => reject(error)
  })
}

/**
 * Draws and wraps text onto a canvas context, breaking lines as needed.
 * Also draws a stroke (outline) for better readability.
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
 * @param {string} text - The text to wrap and draw.
 * @param {number} x - X coordinate for text start.
 * @param {number} y - Y coordinate for text start.
 * @param {number} maxWidth - Maximum width for each line.
 * @param {number} lineHeight - Height of each line.
 */
export function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.strokeText(line, x, y);
  ctx.fillText(line, x, y);
}

/**
 * Splits text into lines that fit within a given width, for later drawing.
 * @param {CanvasRenderingContext2D} ctx - The canvas context to measure text.
 * @param {string} text - The text to wrap.
 * @param {number} maxWidth - Maximum width for each line.
 * @returns {string[]} - Array of lines, each fitting within maxWidth.
 */
export function getWrappedLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  let lines = [];
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  return lines;
}

/**
 * Checks a fetch Response and throws an error if not ok.
 * @param {Response} response
 * @returns {Promise<Response>}
 * @throws {Error}
 */
export async function checkFetchResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Fetch request failed');
  }
  return response;
}