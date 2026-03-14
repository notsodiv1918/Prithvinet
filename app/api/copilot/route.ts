import { NextRequest, NextResponse } from 'next/server';
import { COPILOT_CONTEXT } from '@/data/newModulesData';
import { INDUSTRIES, STATIONS, PRESCRIBED_LIMITS } from '@/data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Staff AI Copilot — server-side route
// Uses Groq API — requires GROQ_API_KEY in .env.local
// Model: llama-3.3-70b-versatile (free, fast)
// ─────────────────────────────────────────────────────────────────────────────

function buildDispersionContext() {
  return INDUSTRIES.map(ind => {
    const nearby = STATIONS.filter(s => s.district === ind.district);
    const avgAqi = nearby.length
      ? Math.round(nearby.reduce((a, s) => a + s.aqi, 0) / nearby.length)
      : 0;
    const contrib = Math.round(
      ((ind.currentSo2 / PRESCRIBED_LIMITS.so2
      + ind.currentNo2 / PRESCRIBED_LIMITS.no2
      + ind.currentPm25 / PRESCRIBED_LIMITS.pm25) / 3) * 40
    );
    return {
      name: ind.name, district: ind.district, type: ind.type,
      assignedRO: ind.assignedRO, complianceRate: ind.complianceRate,
      currentSo2: ind.currentSo2, currentNo2: ind.currentNo2, currentPm25: ind.currentPm25,
      nearbyAqi: avgAqi, estimatedAqiContribution: contrib,
    };
  });
}

function buildSystemPrompt(userRole: string): string {
  const ctx        = COPILOT_CONTEXT;
  const dispersion = buildDispersionContext();

  return `You are PrithviNet AI Compliance Copilot for Maharashtra State Pollution Control Board (MPCB).

USER ROLE: ${userRole}

CAUSAL MODEL FOR SIMULATIONS:
- Each industry's SO2, NO2, PM2.5 contribute to nearby district AQI
- Contribution = ((SO2/limit + NO2/limit + PM2.5/limit) / 3) x 40 AQI points
- Emission reduction of X% -> AQI contribution drops by ~X%
- AQI recovery lag after curtailment: 2-4 days
- Festival period top-2 curtailment + reduced traffic -> 15-25% district AQI drop

LIVE STATION DATA:
${JSON.stringify(STATIONS.map(s => ({ name: s.name, district: s.district, aqi: s.aqi, so2: s.so2, no2: s.no2, pm25: s.pm25, status: s.status })))}

INDUSTRY DATA WITH AQI CONTRIBUTIONS:
${JSON.stringify(dispersion)}

PRESCRIBED LIMITS: SO2=${PRESCRIBED_LIMITS.so2}ppm | NO2=${PRESCRIBED_LIMITS.no2}ppm | PM2.5=${PRESCRIBED_LIMITS.pm25}ug/m3 | AQI safe=${PRESCRIBED_LIMITS.aqi}

RISK SCORES:
${JSON.stringify(ctx.riskScores.map(r => ({ name: r.industryName, district: r.district, score: r.totalRisk, level: r.riskLevel })))}

ACTIVE ESCALATIONS:
${JSON.stringify(ctx.escalations.filter(e => e.status !== 'Resolved').map(e => ({ id: e.id, industry: e.industryName, level: e.level, status: e.status, days: e.daysExceeded })))}

UNACKNOWLEDGED ALERTS:
${JSON.stringify(ctx.autoAlerts.map(a => ({ station: a.stationName, rule: a.ruleName, value: a.triggeredValue, threshold: a.threshold, severity: a.severity })))}

RESPONSE RULES:
- Lead with the direct answer
- For simulations: show before/after numbers with +/- uncertainty range
- Under 350 words unless a detailed breakdown is requested
- End simulations with: Model estimate (+-15%). Actual outcomes depend on meteorological conditions.
- ${userRole === 'Industry User' ? 'Focus only on Bharat Steel Works, Nagpur.' : 'Full cross-industry and cross-district analysis.'}`;
}

const CITIZEN_SYSTEM = `You are PrithviNet Environmental Assistant, a helpful public-facing AI for citizens of Maharashtra.

You can discuss:
- What AQI numbers mean and how they affect health
- Air pollutants: PM2.5, PM10, SO2, NO2, ozone in plain language
- Water quality parameters: pH, dissolved oxygen, BOD, turbidity
- Noise pollution: decibel levels, health impacts, how to protect yourself
- General precautions and protective actions
- When to seek medical help
- How to file a complaint with MPCB
- Environmental awareness and pollution causes

You must NEVER discuss:
- Industry names, compliance rates, violation data, risk scores
- Internal MPCB enforcement actions or investigations
- Any internal system data, staff names, or regulatory proceedings

TONE: Friendly, clear, reassuring. Simple language. No jargon.
LENGTH: 3-5 sentences for simple questions, up to 150 words for detailed ones.
EMERGENCY: If someone describes a medical emergency from pollution, immediately advise: call 112 or visit the nearest hospital.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  // ── API key check ──────────────────────────────────────────────────────────
  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'missing_api_key',
        message: 'GROQ_API_KEY is not configured. Add it to .env.local and restart.',
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { messages, userRole, mode } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages array required.' }, { status: 400 });
    }

    const systemPrompt = mode === 'citizen'
      ? CITIZEN_SYSTEM
      : buildSystemPrompt(userRole || 'Regional Officer');

    // ── Groq API call (OpenAI-compatible format) ───────────────────────────
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:      'llama-3.3-70b-versatile',
        max_tokens: mode === 'citizen' ? 512 : 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error(`Groq error ${response.status}:`, errBody);
      return NextResponse.json(
        { error: 'upstream_error', status: response.status, detail: errBody },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? '';

    if (!text) {
      return NextResponse.json({ error: 'empty_response' }, { status: 502 });
    }

    return NextResponse.json({ reply: text });

  } catch (err: any) {
    console.error('Copilot route error:', err);
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 });
  }
}
