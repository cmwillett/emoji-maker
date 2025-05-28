function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function base64ToBlob(base64: string, mime: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}


export async function removeBackground(file: File): Promise<Blob | { error: 'no_foreground' }> {
  // Convert File to base64
  const base64 = await fileToBase64(file);

  // Strip out the base64 prefix (e.g., "data:image/png;base64,...")
  const base64Data = base64.split(',')[1];

  const res = await fetch("https://us-central1-genuine-grid-461215-p6.cloudfunctions.net/remove_background", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Data }),
  });

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

  const json = await res.json();
  const resultBase64 = json.image;

  // Convert base64 back to Blob
  return base64ToBlob(resultBase64, "image/png");
}
