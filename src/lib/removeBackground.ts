import { removeBackground, Config } from '@imgly/background-removal';

const config: Config = {
  model: "isnet",
  output: {
    quality: 1.0
  }
};

export async function removeBackgroundLocal(file: Blob): Promise<Blob> {
  // If your version of removeBackground accepts a Blob directly, use this:
  console.log('IMGLY Model:', config.model);
  const result = await removeBackground(file);
  if (!result) throw new Error('Background removal failed (result is undefined).');
  // If result is already a Blob, just return it:
  return result as Blob;
}