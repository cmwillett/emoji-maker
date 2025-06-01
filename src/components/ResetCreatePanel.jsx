import React from 'react';

export default function ResetCreatePanel({ onReset, onCreate }) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4 flex flex-col items-center gap-2">
      <h2 className="block text-emerald-400 font-semibold drop-shadow-md mb-2 underline">
        Reset/Create
      </h2>
      <button
        className="text-xs rounded px-2 border cursor-pointer bg-white text-black border-white hover:bg-gray-200"
        onClick={onReset}
      >
        Start Over
      </button>
      <button
        className="text-xs rounded px-2 border cursor-pointer bg-white text-black border-white hover:bg-gray-200"
        onClick={onCreate}
      >
        Create Emoji/Meme
      </button>
    </div>
  );
}