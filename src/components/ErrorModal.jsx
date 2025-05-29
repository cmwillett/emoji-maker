import React from 'react';
import { Modal } from '@mui/material';

export default function ErrorModal({ open, errorMessage, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
        <h2 id="error-modal-title" className="text-lg font-bold text-red-600 mb-2">Error</h2>
        <p id="error-modal-description" className="text-gray-700 mb-4">{errorMessage}</p>
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