import React from 'react';

export default function StyleOptions({
  isRound,
  setIsRound,
}) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <div className="mt-4 text-center">
        <p className="text-emerald-400 font-semibold drop-shadow-md mb-2">Style Options</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-white">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isRound}
              onChange={(e) => setIsRound(e.target.checked)}
            />
            Circular Emoji
          </label>
        </div>
      </div>
    </div>
  );
}