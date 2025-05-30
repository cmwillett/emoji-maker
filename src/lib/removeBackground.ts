import { removeBackground } from '@imgly/background-removal';

export async function removeBackgroundLocal(file: Blob): Promise<Blob> {
  // If your version of removeBackground accepts a Blob directly, use this:
  const result = await removeBackground(file);
  if (!result) throw new Error('Background removal failed (result is undefined).');
  // If result is already a Blob, just return it:
  return result as Blob;
}