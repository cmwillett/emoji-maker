export function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (err) => reject(err))
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = url
  })
}

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

