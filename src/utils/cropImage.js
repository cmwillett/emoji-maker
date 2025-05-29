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
