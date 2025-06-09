import heic2any from 'heic2any';

export async function handleFileInput(e, onImageSelect) {
  if (typeof onImageSelect !== 'function') {
    throw new Error('onImageSelect must be a function');
  }
  const file = e.target.files?.[0];
  if (!file) return;

  if (isHeicImage(file)) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/png",
      });
      const dataUrl = await readBlobAsDataURL(convertedBlob);
      onImageSelect(dataUrl);
    } catch (error) {
      console.error("HEIC conversion failed:", error);
      alert("Failed to process HEIC image. Please try another format.");
    }
  } else {
    const dataUrl = await readBlobAsDataURL(file);
    onImageSelect(dataUrl);
  }
}

/**
 * Reads a Blob or File and returns a Promise that resolves to a Data URL.
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
export function readBlobAsDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Checks if a file is a HEIC image.
 * @param {File} file
 * @returns {boolean}
 */
export function isHeicImage(file) {
  return (
    file.type === "image/heic" ||
    (file.name && file.name.toLowerCase().endsWith(".heic"))
  );
}