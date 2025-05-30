import React from 'react';

export default function EmojiTextInput({ emojiText, setEmojiText }) {
  return (
    <input
      type="text"
      value={emojiText}
      onChange={(e) => setEmojiText(e.target.value)}
      placeholder="Add text to your emoji"
      className="mb-2 p-1 border rounded"
    />
  );
}