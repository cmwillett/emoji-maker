export const applyBackgroundColor = async (transparentBlob, backgroundColor) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((finalBlob) => {
        resolve(finalBlob);
      }, 'image/png');
    };
    img.src = URL.createObjectURL(transparentBlob);
  });
};

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

export const fetchEmojiCount = async (setEmojiCount) => {
  try {
    const res = await fetch('/api/getEmojiCount');
    const data = await res.json();
    setEmojiCount(data.count);
  } catch (err) {
    console.error('Failed to fetch emoji count', err);
  }
};

export default function getCroppedImg(imageSrc, pixelCrop, mimeType = 'image/png', returnBlob = false) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = imageSrc

    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext('2d')

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

    image.onerror = (error) => reject(error)
  })
}

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

// Helper to split text into lines
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


