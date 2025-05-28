export async function removeBackground(file: File): Promise<Blob | { error: 'no_foreground' }> {
  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  const res = await fetch("https://us-central1-genuine-grid-461215-p6.cloudfunctions.net/remove_background", {
    method: "POST",
    body: formData,
  });

  
  //https://api.remove.bg/v1.0/removebg

  if (!res.ok) {
    const errText = await res.text();

    try {
      const errJson = JSON.parse(errText);
      const errCode = errJson?.errors?.[0]?.code;

      if (errCode === "unknown_foreground") {
        return { error: "no_foreground" };
      }
    } catch {
      // fail silently and fall through to throw
    }

    throw new Error(`Remove.bg failed: ${res.status} - ${errText}`);
  }

  return await res.blob(); // PNG with background removed
}
