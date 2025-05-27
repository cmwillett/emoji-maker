import { useState } from 'react';

export default function BgRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('https://emoji-api-tphz.onrender.com/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to remove background');

      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert('Error removing background.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {previewUrl && <img src={previewUrl} alt="Original" className="max-w-xs rounded" />}
      
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!selectedFile || loading}
      >
        {loading ? 'Processing...' : 'Remove Background'}
      </button>

      {resultUrl && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Result</h3>
          <img src={resultUrl} alt="No background" className="max-w-xs rounded" />
        </div>
      )}
    </div>
  );
}
