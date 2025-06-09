import { Modal } from '@mui/material';

/**
 * ContactModal component displays a modal dialog for users to send a contact message.
 * @param {boolean} open - Controls whether the modal is visible.
 * @param {function} onClose - Function to close the modal.
 * @param {object} contactForm - The current state of the contact form fields.
 * @param {function} setContactForm - Setter for updating contact form fields.
 * @param {boolean} contactSubmitted - Whether the message has been successfully sent.
 * @param {function} setContactSubmitted - Setter to update submission state.
 */
export default function ContactModal({
  open,
  onClose,
  contactForm,
  setContactForm,
  contactSubmitted,
  setContactSubmitted,
}) {
  return (
    // MUI Modal for accessibility and overlay
    <Modal open={open} onClose={onClose}>
      {/* Centered modal content with styling */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md box-border overflow-x-hidden">
        {/* Close button in the top-right corner */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Modal title */}
        <h2 className="text-lg font-bold text-emerald-600 mb-4">Contact Us</h2>
        {/* Show thank you message if submitted, otherwise show the form */}
        {contactSubmitted ? (
          <p className="text-green-600">Thanks! Your message has been sent.</p>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                // Send form data to backend API
                const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(contactForm),
                });
                if (res.ok) {
                  setContactSubmitted(true);
                }
              } catch (err) {
                console.error(err);
                alert('Error sending message.');
              }
            }}
          >
            {/* Name input */}
            <input
              type="text"
              placeholder="Your Name"
              className="w-full box-border px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              required
            />
            {/* Email input */}
            <input
              type="email"
              placeholder="Your Email"
              className="w-full box-border px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              required
            />
            {/* Message textarea */}
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full box-border px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              required
            />
            {/* Submit button */}
            <button
              type="submit"
              className="w-full box-border rounded px-4 py-2 bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}