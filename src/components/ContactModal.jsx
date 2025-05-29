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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold text-emerald-600 mb-4">Contact Us</h2>
        {contactSubmitted ? (
          <p className="text-green-600">Thanks! Your message has been sent.</p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full mb-4 px-3 py-2 border rounded"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            />
            <button
              className="btn-primary w-full"
              onClick={async () => {
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
              Send Message
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}