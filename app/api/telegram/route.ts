import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// ─────────────────────────────────────────────────────────────────────────────
// Telegram Webhook — file-based storage so GET and POST share the same data
// ─────────────────────────────────────────────────────────────────────────────

const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN || '8653135171:AAGK3CC8yF2hug-gfjrBvyTAww1B97DsEdk';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const STORE_FILE  = join(process.cwd(), 'telegram-complaints.json');

export interface TelegramComplaint {
  id:          string;
  refNo:       string;
  telegramId:  number;
  username:    string;
  message:     string;
  category:    string;
  submittedAt: string;
  status:      'Submitted' | 'Under Review' | 'Resolved';
}

function readComplaints(): TelegramComplaint[] {
  try {
    if (!existsSync(STORE_FILE)) return [];
    return JSON.parse(readFileSync(STORE_FILE, 'utf-8'));
  } catch { return []; }
}

function writeComplaints(complaints: TelegramComplaint[]): void {
  try { writeFileSync(STORE_FILE, JSON.stringify(complaints, null, 2)); } catch {}
}

async function sendMessage(chatId: number, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

function detectCategory(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('air') || t.includes('smoke') || t.includes('dust') || t.includes('aqi') || t.includes('burn')) return 'Air Pollution';
  if (t.includes('water') || t.includes('river') || t.includes('lake') || t.includes('drain'))                   return 'Water Pollution';
  if (t.includes('noise') || t.includes('sound') || t.includes('loud') || t.includes('music'))                   return 'Noise Pollution';
  if (t.includes('dump') || t.includes('waste') || t.includes('garbage') || t.includes('trash'))                 return 'Illegal Dumping';
  return 'Other';
}

function genRef(): string {
  const d    = new Date();
  const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return `PVN-TG-${date}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body    = await req.json();
    const message = body?.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId   = message.chat.id;
    const username = message.from?.first_name || message.from?.username || 'Anonymous';
    const text     = message.text || '';

    if (text === '/start') {
      await sendMessage(chatId,
        `<b>Welcome to PrithviNet Complaint Portal</b>\n\nI am the official Maharashtra SPCB complaint bot.\n\nTo file a complaint just send me a message describing:\n- What type of pollution you are seeing\n- Where it is happening\n- Any other details\n\nExample:\n<i>Black smoke from factory near Butibori MIDC Nagpur since 3 days</i>\n\nYour complaint will be reviewed by a Regional Officer within 3 working days.\n\nEmergency: Call 112 or MPCB Helpline 1800-233-3535`
      );
      return NextResponse.json({ ok: true });
    }

    if (text === '/status') {
      const all  = readComplaints();
      const mine = all.filter(c => c.telegramId === chatId);
      if (mine.length === 0) {
        await sendMessage(chatId, 'You have no complaints filed yet. Send a message to file one.');
      } else {
        const list = mine.map(c =>
          `Ref: <b>${c.refNo}</b>\nCategory: ${c.category}\nStatus: <b>${c.status}</b>\nFiled: ${c.submittedAt}`
        ).join('\n\n');
        await sendMessage(chatId, `<b>Your Complaints:</b>\n\n${list}`);
      }
      return NextResponse.json({ ok: true });
    }

    if (text === '/help') {
      await sendMessage(chatId,
        `<b>Commands:</b>\n/start - Welcome message\n/status - Check your complaints\n/help - Show this message\n\nOr just send a message describing the pollution issue.`
      );
      return NextResponse.json({ ok: true });
    }

    // New complaint
    const refNo    = genRef();
    const category = detectCategory(text);
    const now      = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const complaint: TelegramComplaint = {
      id:          `TG_${Date.now()}`,
      refNo,
      telegramId:  chatId,
      username,
      message:     text,
      category,
      submittedAt: now,
      status:      'Submitted',
    };

    const all = readComplaints();
    all.unshift(complaint);
    writeComplaints(all);

    await sendMessage(chatId,
      `<b>Complaint Registered</b>\n\nThank you ${username}. Your complaint has been received.\n\nReference: <b>${refNo}</b>\nCategory: ${category}\nStatus: Submitted\n\nA Regional Officer will review this within 3 working days.\n\nSend /status to track your complaint.\nMPCB Helpline: 1800-233-3535`
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('Telegram webhook error:', err);
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  const complaints = readComplaints();
  return NextResponse.json({ complaints });
}
