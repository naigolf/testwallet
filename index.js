const crypto = require('crypto');
const axios = require('axios');

// อ่านค่า API Key/Secret จาก GitHub Secrets
const API_KEY = process.env.BTK_API_KEY;
const API_SECRET = process.env.BTK_API_SECRET;

async function main() {
  const host = 'https://api.bitkub.com';
  const path = '/api/v3/market/wallet';
  const url = host + path;

  const ts = await getServerTime();
  const method = 'POST';
  const body = {}; // JSON payload
  const bodyString = JSON.stringify(body); // ต้องเป็น '{}'

  // 🔏 สร้าง Signature string
  const signatureString = `${ts}${method}${path}${bodyString}`;
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
    const response = await axios.post(url, body, { headers });
    console.log('✅ Wallet Result:', response.data);
  } catch (error) {
    console.error('❌ Error calling Bitkub Wallet:', error.response?.data || error.message);
  }
}

async function getServerTime() {
  const response = await axios.get('https://api.bitkub.com/api/v3/servertime');
  return response.data.toString(); // ต้องแปลงเป็น string
}

main();
