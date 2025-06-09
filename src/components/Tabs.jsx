import { Stack } from '@mui/material';
import { panelBase } from '../lib/classNames';

/**
 * Tabs renders a tabbed navigation UI for switching between options.
 *
 * @param {string[]} tabs - Array of tab names.
 * @param {string} activeTab - Currently selected tab.
 * @param {function} setActiveTab - Handler to change the active tab.
 */
export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className={`${panelBase} rounded-lg p-4 mb-4 gap-2`}>
      <Stack direction="column" spacing={1} className="mt-1 mb-2 items-center">
        <h2 className="text-center text-emerald-400 font-semibold drop-shadow-md mb-0 underline">
          Step 2
        </h2>
        <p className="text-center text-emerald-400 font-semibold drop-shadow-md mb-0 mt-1">
          Zoom or adjust the photo above
        </p>
        <p className="text-center text-emerald-400 font-semibold drop-shadow-md mb-4 mt-1">
          And/or choose options below
        </p>
      </Stack>
      <div className="flex justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`mt-2 px-4 py-2 font-semibold rounded border cursor-pointer mx-1
              ${
                activeTab === tab
                  ? 'bg-white text-emerald-400 border-white'
                  : 'bg-emerald-900 text-emerald-200 border-emerald-700 hover:bg-emerald-800'
              }
            `}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}