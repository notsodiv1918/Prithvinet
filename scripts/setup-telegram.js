const BOT_TOKEN  = '8653135171:AAGK3CC8yF2hug-gfjrBvyTAww1B97DsEdk';
const NGROK_URL  = 'https://postsystolic-nonhierarchic-ryan.ngrok-free.dev';
const WEBHOOK    = `${NGROK_URL}/api/telegram`;

async function setup() {
  console.log('Registering webhook:', WEBHOOK);
  const res  = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ url: WEBHOOK }),
  });
  const data = await res.json();
  if (data.ok) {
    console.log('Done! Bot is live at: https://t.me/Pritvinet_Bot');
  } else {
    console.error('Error:', JSON.stringify(data));
  }
}
setup();
