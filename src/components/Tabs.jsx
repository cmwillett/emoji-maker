import React from 'react';

export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
      <h2 className="text-center text-emerald-400 font-semibold drop-shadow-md mb-2 underline">
        Options
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