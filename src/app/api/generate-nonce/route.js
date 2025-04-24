import axios from 'axios';

export async function POST(req) {
  try {
    const { user_id, user_agent, ip_address } = await req.json();

    if (!user_id || !user_agent) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const response = await axios.post(
      'https://api.printful.com/embedded-designer/nonces',
      {
        external_customer_id: user_id,
        user_agent,
        ip_address: ip_address || '127.0.0.1',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const nonce = response.data?.result?.nonce;

    if (!nonce) {
      console.error('Printful did not return a nonce:', response.data);
      return new Response(JSON.stringify({ error: 'Printful did not return a nonce' }), { status: 500 });
    }

    return new Response(JSON.stringify({ nonce }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('🔥 Full error from Printful:', err?.response?.data || err.message);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate nonce',
        details: err?.response?.data || err.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
