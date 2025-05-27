export async function removeBackground(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": import.meta.env.VITE_REMOVEBG_API_KEY!,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Remove.bg failed: ${res.status} - ${errText}`);
  }

  return await res.blob(); // this will be a PNG with the background removed
}
