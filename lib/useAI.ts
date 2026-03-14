// ─────────────────────────────────────────────────────────────────────────────
// useAI — calls /api/copilot (Next.js server-side route)
//
// WHY A SERVER ROUTE?
// The Anthropic API requires an API key in the x-api-key header.
// API keys must never be exposed in browser code.
// The Next.js API route reads the key from process.env (server-only)
// and proxies the request to Anthropic securely.
//
// Client-side direct calls to api.anthropic.com fail because:
//   1. No API key can safely be included in browser code
//   2. Anthropic's CORS policy blocks direct browser requests
// ─────────────────────────────────────────────────────────────────────────────

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIOptions {
  messages:   AIMessage[];
  system?:    string;      // unused — system prompt is built server-side
  userRole?:  string;      // 'Super Admin' | 'Regional Officer' | 'Industry User' | etc.
  mode?:      'staff' | 'citizen';  // controls which system prompt the server uses
  maxTokens?: number;      // ignored server-side (controlled per mode)
}

export interface AIResult {
  reply:   string;
  error?:  string;
  isMissingKey?: boolean;
}

// ── Main caller ───────────────────────────────────────────────────────────────
export async function callAI(opts: AIOptions): Promise<AIResult> {
  try {
    const res = await fetch('/api/copilot', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: opts.messages,
        userRole: opts.userRole ?? 'Regional Officer',
        mode:     opts.mode     ?? 'staff',
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error === 'missing_api_key') {
        return { reply: '', error: data.message, isMissingKey: true };
      }
      return { reply: '', error: `Server error ${res.status}: ${data.error ?? 'Unknown'}` };
    }

    return { reply: data.reply };

  } catch (err: any) {
    return { reply: '', error: err.message ?? 'Network error' };
  }
}

// ── Fallback content shown when API key is not yet configured ─────────────────
export const SETUP_MESSAGE = `⚙️ **AI Copilot Setup Required**

The AI Copilot needs an Anthropic API key to work.

**Quick setup (2 minutes):**
1. Go to **console.anthropic.com** → sign up or log in
2. Click **"API Keys"** in the left sidebar
3. Click **"Create Key"** → copy the key (starts with \`sk-ant-\`)
4. Create a file called \`.env.local\` in your project root folder
5. Add this line: \`ANTHROPIC_API_KEY=sk-ant-your-key-here\`
6. Restart the dev server: \`npm run dev\`

The Copilot will work immediately after restart.

📞 Meanwhile, check the **Risk Scores**, **Escalations**, and **Alert Rules** pages for current compliance data.`;

export const FALLBACK_STAFF = `⚠️ **AI service temporarily unavailable.**

Current status from live data:
- **Nagpur Butibori MIDC** — AQI 267, SO₂ 156 ppm (limit: 80 ppm) — Active breach
- **Bharat Steel Works** — 7-day SO₂ breach, Show Cause escalation open
- **3 unacknowledged alerts** across air, water and noise domains

Please check the **Risk Scores**, **Escalations**, and **Alert Rules** pages directly, or retry in a moment.`;

export const FALLBACK_CITIZEN = `⚠️ **Assistant temporarily unavailable.** Here are quick tips:

🌿 **Air Quality:** AQI above 150 = reduce outdoor activity. Wear an N95 mask if you must go out.

💧 **Water Safety:** Never drink untreated river water. Avoid rivers rated Poor or Critical.

🔊 **Noise:** Prolonged exposure above 85 dB(A) can damage hearing. Use earplugs in noisy areas.

📞 **Emergency:** MPCB Helpline: 1800-233-3535 (Toll Free) · Emergency: 112

Please try again in a moment.`;
