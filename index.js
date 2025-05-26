const crypto = require('crypto');
const axios = require('axios');

// 🧾 ตั้งค่า API ของคุณที่ GitHub Secrets
const API_KEY = process.env.BTK_API_KEY;
const API_SECRET = process.env.BTK_API_SECRET;

async function main() {
  const host = 'https://api.bitkub.com';
  const path = '/api/v3/market/wallet';

  // ดึง server time
  const ts = await getServerTime();

  // สร้าง Signature String
  const signatureString = `${ts}POST${path}{}`;
  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(signatureString)
    .digest('hex');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-BTK-TIMESTAMP': ts,
    'X-BTK-SIGN': signature,
    'X-BTK-APIKEY': API_KEY
  };

  try {
    const response = await axios.post(`${host}${path}`, {}, { headers });
    console.log('✅ Wallet Result:', response.data);
  } catch (error) {
    console.error('❌ Error calling Bitkub Wallet:', error.response?.data || error.message);
  }
}

async function getServerTime() {
  const response = await axios.get('https://api.bitkub.com/api/v3/servertime');
  return response.data.toString();
}

main();
