import React from 'react';
import { Modal } from '@mui/material';

export default function AboutModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="about-modal-title"
      aria-describedby="about-modal-description"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-gray-800">
        <h2 id="about-modal-title" className="text-lg font-bold mb-2">About this App</h2>
        <p id="about-modal-description" className="mb-4 text-sm">
          This emoji maker lets you turn any photo into a custom emoji. Not an emoji that you can use in messaging apps straight away 
          (those are unicode and are part of the actual app, so this wouldn't be able to do so).
          Here are a few things you can do with the app though:
            - crop the photo
            - remove the background
            - choose a background color
            - apply styles like borders or shadows
          Once you have it set, you can then:
            - share your emoji
            - copy it to clipboard
            - download it
        </p>
        <button
          className="btn-primary w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}