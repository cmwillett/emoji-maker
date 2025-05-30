import React from 'react';

export default function Header({ emojiCount }) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-lg">The Craig's</h1>
        <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-lg">Emoji/Meme Maker</h1>
        {emojiCount !== null && (
          <p className="text-sm text-emerald-400 mt-2 font-bold underline">
            {emojiCount.toLocaleString()} created so far!
          </p>
        )}
      </div>
    </div>
  );
}