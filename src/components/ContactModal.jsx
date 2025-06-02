import React from 'react';
import { Modal } from '@mui/material';

export default function ContactModal({
  open,
  onClose,
  contactForm,
  setContactForm,
  contactSubmitted,
  setContactSubmitted,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md box-border overflow-x-hidden">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold text-emerald-600 mb-4">Contact Us</h2>
        {contactSubmitted ? (
          <p className="text-green-600">Thanks! Your message has been sent.</p>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
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
            <input
              type="text"
              placeholder="Your Name"
              className="w-full box-border px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full box-border px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              required
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full box-border px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              required
            />
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