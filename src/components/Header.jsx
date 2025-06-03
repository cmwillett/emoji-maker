import React from 'react';

export default function Header({ emojiCount }) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-2 mb-4">
      <div className="flex flex-col items-center space-y-1">
        <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-lg underline mt-0 mb-0">The Craig's</h1>
        <img src="/logo.png" width="150" height="150"/>
        <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-lg underline mt-0">Emoji/Meme Maker</h1>
        {emojiCount !== null && (
          <p className="text-sm text-emerald-400 mt-2 font-bold underline">
            {emojiCount.toLocaleString()} created so far!
          </p>
        )}
      </div>
    </div>
  );
}