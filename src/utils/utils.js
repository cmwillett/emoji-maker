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


