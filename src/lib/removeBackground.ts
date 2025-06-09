import { removeBackground, Config } from '@imgly/background-removal';

/**
 * Configuration for the background removal model.
 * Uses the "isnet" model with maximum output quality.
 */
const config: Config = {
  model: "isnet",
  output: {
    quality: 1.0
  }
};

/**
 * Removes the background from an image Blob using the IMGLY library.
 *
 * @param {Blob} file - The image file as a Blob.
 * @returns {Promise<Blob>} - A promise that resolves to the processed image Blob.
 * @throws {Error} If background removal fails.
 */
export async function removeBackgroundLocal(file: Blob): Promise<Blob> {
  // If your version of removeBackground accepts a Blob directly, use this:
  console.log('IMGLY Model:', config.model);
  const result = await removeBackground(file);
  if (!result) throw new Error('Background removal failed (result is undefined).');
  // If result is already a Blob, just return it:
  return result as Blob;
}