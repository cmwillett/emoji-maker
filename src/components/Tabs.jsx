import React from 'react';

export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4 gap-2">
      <h2 className="flex justify-center text-emerald-400 font-semibold drop-shadow-md mb-0">
        Step 2. Zoom/Adjust the photo above
      </h2>
      <h2 className="flex justify-center text-emerald-400 font-semibold drop-shadow-md mb-4 mt-0">
        and/or choose options below
      </h2>
      <div className="flex justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold rounded border cursor-pointer mx-1
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