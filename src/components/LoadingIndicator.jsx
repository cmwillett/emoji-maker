import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="mt-6 flex flex-col items-center space-y-2">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      <p className="text-emerald-400 mt-2">Processing your emoji...</p>
      <p className="text-emerald-400 mt-2">This can take a minute...</p>
    </div>
  );
}