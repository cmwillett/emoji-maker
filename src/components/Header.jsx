/**
 * Header displays the app title, logo, and total emoji/meme count.
 *
 * @param {number|null} emojiCount - The total number of emojis/memes created (can be null).
 */
import { panelBase } from "../lib/classNames";

export default function Header({ emojiCount, leftButton, rightButton, onRefreshCount }) {
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
        <a
          href="https://photos.app.goo.gl/fDPai7Yu1UEf6uTM8"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl text-emerald-400 mt-2 font-bold underline"
        >
          View some creations!
        </a>        
        {emojiCount !== null && (
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-sm text-emerald-400 font-bold underline mb-0">
              {emojiCount.toLocaleString()} created so far!
            </p>
            <button
              onClick={onRefreshCount}
              className="ml-2 px-1 py-0 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded font-bold align-baseline"
              style={{ height: '1.5em', width: '1.5em', minWidth: 0, minHeight: 0, padding: 0 }}
              title="Refresh emoji count"
            >
              ⟳
            </button>
          </div>
        )}      
      </div>
    </div>
  );
}