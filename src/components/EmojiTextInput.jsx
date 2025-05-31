import React from 'react';

export default function EmojiTextInput({ emojiText, setEmojiText }) {
  return (
    <div>
      <p className="text-emerald-400 font-semibold drop-shadow-md mb-2 text-center">Add Text?</p>
      <input
        type="text"
        value={emojiText}
        onChange={(e) => setEmojiText(e.target.value)}
        placeholder="Add text here"
        className="mb-2 p-1 border rounded"
      />
    </div>
  );
}