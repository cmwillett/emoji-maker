import React from 'react';
import { Modal } from '@mui/material';

/**
 * AboutModal component displays information about the app in a modal dialog.
 * @param {boolean} open - Controls whether the modal is visible.
 * @param {function} onClose - Function to call when the modal should be closed.
 */
export default function AboutModal({ open, onClose }) {
  return (
    // MUI Modal component for accessibility and overlay
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="about-modal-title"
      aria-describedby="about-modal-description"
    >
      {/* Centered modal content with styling */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-gray-800">
        {/* Modal title */}
        <h2 id="about-modal-title" className="text-lg font-bold mb-2">About this App</h2>
        {/* App description */}
        <p id="about-modal-description" className="mb-4 text-sm">
          This emoji/meme maker lets you turn any photo into a custom emoji/meme. Not an emoji that you can use in messaging apps straight away 
          (those are unicode and are part of the actual app, so this wouldn't be able to do so), but one that you can make look like
          an emoji.
        </p>
        {/* Feature list */}
        <div className="mb-4 text-sm">
          <div className="font-semibold mb-1">Here are a few things you can do with the app:</div>
          <ul className="list-disc list-inside ml-4">
            <li>Crop the photo</li>
            <li>Remove the background</li>
            <li>Choose a background color</li>
            <li>Apply styles</li>
            <li>Add text to the photo</li>
            <li>Set the text color</li>
          </ul>
          {/* Actions list */}
          <div className="font-semibold mt-3 mb-1">Once you have it set, you can then:</div>
          <ul className="list-disc list-inside ml-4">
            <li>Share your photo</li>
            <li>Copy it to clipboard</li>
            <li>Download it</li>
          </ul>
        </div>
        {/* Close button */}
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