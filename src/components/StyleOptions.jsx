/**
 * StyleOptions provides UI controls for selecting emoji/meme style.
 *
 * @param {boolean} isRound - Whether the emoji should be circular.
 * @param {function} setIsRound - Handler to toggle circular style.
 */

import { panelBase } from "../lib/classNames";

export default function StyleOptions({
  isRound,
  setIsRound,
}) {
  return (
    <div className={`${panelBase} rounded-lg p-4 mb-4`}>
      <div className="mt-0 text-center">
        <h2 className="block text-emerald-400 font-semibold drop-shadow-md mb-2 underline mt-0">
          Style Options
        </h2>
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