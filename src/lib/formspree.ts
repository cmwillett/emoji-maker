/**
 * Send a contact form submission to Formspree.
 * @param {object} data - The form data ({ name, email, message }).
 * @returns {Promise<Response>} - The fetch response from Formspree.
 */
export async function sendContactForm(data: { name?: string; email: string; message: string }) {
  return fetch('https://formspree.io/f/xyzwrdby', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}