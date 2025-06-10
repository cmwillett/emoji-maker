/**
 * Header displays the app title, logo, and total emoji/meme count.
 *
 * @param {number|null} emojiCount - The total number of emojis/memes created (can be null).
 */
import { panelBase } from "../lib/classNames";

export default function Header({ emojiCount, leftButton, rightButton }) {
  return (
    <div className={`${panelBase} rounded-lg p-2 mb-4`}>
      {/* Button Row */}
      <div className="flex items-center justify-between w-full mb-2">
        <div>{leftButton}</div>
        <div>{rightButton}</div>
      </div>
      {/* Main Header Content */}
      <div className="flex flex-col items-center space-y-1">
        <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-lg underline mt-0 mb-0">
          The Craig's
        </h1>
        <img src="/logo.png" width="150" height="150" alt="App Logo" />
        <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-lg underline mt-0">
          Emoji/Meme Maker
        </h1>
        {emojiCount !== null && (
          <p className="text-sm text-emerald-400 mt-2 font-bold underline">
            {emojiCount.toLocaleString()} created so far!
          </p>
        )}
      </div>
    </div>
  );
}