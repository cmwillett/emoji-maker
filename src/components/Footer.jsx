import React from 'react';

export default function Footer({ onAbout, onContact }) {
  return (
    <footer className="mt-8 w-full text-center space-y-2">
      <div className="flex justify-center gap-4">
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
      <p className="text-xs text-emerald-500 mt-1">© 2025 The Craig, Inc.</p>
    </footer>
  );
}