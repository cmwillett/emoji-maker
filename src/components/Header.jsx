import React from 'react';

export default function Header({ emojiCount }) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-lg">The Craig's</h1>
      <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-lg">Emoji Maker</h1>
      {emojiCount !== null && (
        <p className="text-sm text-emerald-400 mt-2 font-bold underline">
          {emojiCount.toLocaleString()} emojis created so far!
        </p>
      )}
    </div>
  );
}