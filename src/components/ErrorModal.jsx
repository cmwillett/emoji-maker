import { Modal } from '@mui/material';

/**
 * ErrorModal displays an error message in a modal dialog.
 *
 * @param {boolean} open - Controls whether the modal is visible.
 * @param {string} errorMessage - The error message to display.
 * @param {function} onClose - Function to close the modal.
 */
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