// /api/generate-nonce.js

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, user_agent, ip_address, external_product_id } = req.body;

  if (!external_product_id) {
    return res.status(400).json({ error: 'Missing external_product_id' });
  }

  try {
    const response = await axios.post(
      'https://api.printful.com/embedded-designer/nonces',
      {
        external_product_id,
        external_customer_id: user_id || null,
        user_agent: user_agent || null,
        ip_address: ip_address || null,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const nonce = response.data?.result?.nonce;
    return res.status(200).json({ nonce });
  } catch (error) {
    console.error('Error generating nonce:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Failed to generate nonce',
      details: error.response?.data || error.message,
    });
  }
}
