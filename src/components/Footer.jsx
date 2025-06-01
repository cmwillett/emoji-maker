import React from 'react';

export default function Footer({ onAbout, onContact }) {
  return (
    <div className="bg-black/40 border border-emerald-400 rounded-lg p-4 mb-4">
    <footer className="mt-8 w-full text-center space-y-2">
      <div className="flex flex-col items-center gap-2">
        <h2 className="block text-emerald-400 font-semibold drop-shadow-md mb-2 underline">
          About / Contact
        </h2>
        <div className="flex gap-4">
          <button
            className="px-3 py-1 rounded bg-white bg-opacity-20 text-emerald-100 font-medium backdrop-blur hover:bg-opacity-30 hover:text-white transition"
            onClick={onAbout}
          >
            About this app
          </button>
          <button
            className="px-3 py-1 rounded bg-white bg-opacity-20 text-emerald-100 font-medium backdrop-blur hover:bg-opacity-30 hover:text-white transition"
            onClick={onContact}
          >
            Contact
          </button>
        </div>
      </div>
      <p className="text-xs text-emerald-500 mt-1">© 2025 The Craig, Inc.</p>
    </footer>
    </div>
  );
}