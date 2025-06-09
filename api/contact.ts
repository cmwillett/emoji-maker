import { sendContactForm } from '../src/lib/formspree';

export const config = {
  runtime: 'edge',
};

/**
 * Edge API handler for contact form submissions.
 * Accepts POST requests with JSON body: { name, email, message }
 * Forwards the data to Formspree and returns a JSON response.
 */
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // Parse JSON body from the request
    const body = await req.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Forward the form data to Formspree using the helper
    const formRes = await sendContactForm({ name, email, message });

    // Handle Formspree errors
    if (!formRes.ok) {
      const errorText = await formRes.text();
      console.error('Formspree error:', errorText);

      return new Response(JSON.stringify({ error: 'Failed to send' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Success response
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // Handle unexpected errors
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}