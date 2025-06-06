export default function LoadingIndicator() {
  return (
    <div className="mt-2 flex flex-col items-center space-y-2">
      <div style={{
        width: 48,
        height: 48,
        border: '4px solid #ccc',
        borderTop: '4px solid #06b6d4',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>
        {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
      </style>
      <p className="text-emerald-400 mt-2">Activating the workers...</p>
      <p className="text-emerald-400 mt-2">Workers are building the photo...</p>
    </div>
  );
}