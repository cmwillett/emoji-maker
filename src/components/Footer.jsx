import { Tooltip } from '@mui/material';
import { EmojiButton } from './EmojiButton';
import { panelBase } from '../lib/classNames';

/**
 * Footer displays About and Contact buttons with tooltips, and copyright.
 *
 * @param {function} onAbout - Handler for the About button.
 * @param {function} onContact - Handler for the Contact button.
 */
export default function Footer({ onAbout, onContact }) {
  return (
    <div className={`${panelBase} rounded-lg p-1 mb-4`}>
      <footer className="mt-2 w-full text-center space-y-2 mb-2">
        <div className="flex flex-col items-center gap-1">
          <h2 className="block text-emerald-400 font-semibold drop-shadow-md mb-2 underline mt-0">
            About / Contact
          </h2>
          <div className="flex gap-4">
            {/* About button with tooltip */}
            <Tooltip title="Click to read about this app..." placement="right">
              <span>
                <EmojiButton
                  label="About this app"
                  onClick={onAbout}
                />
              </span>
            </Tooltip>
            {/* Contact button with tooltip */}
            <Tooltip title="Click to contact the developer about anything" placement="right">
              <span>
                <EmojiButton
                  label="Contact Developer"
                  onClick={onContact}
                />
              </span>
            </Tooltip>
          </div>
        </div>
        <p className="text-small text-emerald-500 mt-1">© 2025 The Craig, Inc.</p>
      </footer>
    </div>
  );
}