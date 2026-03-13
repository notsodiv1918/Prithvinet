import { NextRequest, NextResponse } from 'next/server';
import { COPILOT_CONTEXT } from '@/data/newModulesData';

// ── Causal model helpers ──────────────────────────────────────────────────────
// Approximates regional AQI change if an industry changes emissions by X%
// Based on: each industry contributes proportionally to nearby station AQI
// Dispersion factor: distance-weighted inverse square, simplified to district match
function buildDispersionContext() {
  const { industries, stations, prescribedLimits, riskScores } = COPILOT_CONTEXT;

  const industryContributions = industries.map(ind => {
    const nearbyStations = stations.filter(s => s.district === ind.district);
    const avgAqi = nearbyStations.length > 0
      ? Math.round(nearbyStations.reduce((a, s) => a + s.aqi, 0) / nearbyStations.length)
      : 0;
    const so2Ratio  = ind.currentSo2  / prescribedLimits.so2;
    const no2Ratio  = ind.currentNo2  / prescribedLimits.no2;
    const pm25Ratio = ind.currentPm25 / prescribedLimits.pm25;
    const contribution = Math.round(((so2Ratio + no2Ratio + pm25Ratio) / 3) * 40);
    return { ...ind, nearbyAqi: avgAqi, estimatedAqiContribution: contribution };
  });

  return industryContributions;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userRole } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const dispersionCtx = buildDispersionContext();
    const ctx = COPILOT_CONTEXT;

    const systemPrompt = `You are PrithviNet AI Compliance Copilot — an expert environmental analytics assistant for Maharashtra State Pollution Control Board (MPCB).

CURRENT USER ROLE: ${userRole || 'Regional Officer'}

YOUR CAPABILITIES:
1. What-if simulation: Estimate how emission changes affect regional AQI using a causal model
2. Intervention analysis: Simulate shutdowns, reductions, festival periods
3. Compliance reasoning: Identify risk patterns, missing reports, escalation needs
4. Health impact estimation: Translate pollutant levels into health risk language

CAUSAL MODEL (use this for simulations):
- Each industry's SO₂, NO₂, PM2.5 emissions contribute to nearby district AQI
- Contribution formula: ((SO₂/limit + NO₂/limit + PM2.5/limit) / 3) × 40 = estimated AQI points
- If an industry reduces emissions by X%, its AQI contribution drops proportionally
- AQI recovery lag: approximately 2-4 days for meteorological dispersion
- Festival periods: reduced traffic + temp shutdowns can reduce AQI by 15-25% if top 2 polluters curtail
- Wind dispersion: emissions spread within district boundaries primarily (simplified model)

LIVE STATION DATA:
${JSON.stringify(ctx.stations, null, 2)}

INDUSTRY DATA WITH ESTIMATED AQI CONTRIBUTIONS:
${JSON.stringify(dispersionCtx, null, 2)}

PRESCRIBED LIMITS:
SO₂: ${ctx.prescribedLimits.so2} ppm | NO₂: ${ctx.prescribedLimits.no2} ppm | PM2.5: ${ctx.prescribedLimits.pm25} µg/m³ | AQI safe: ${ctx.prescribedLimits.aqi}

RISK SCORES (pre-computed):
${JSON.stringify(ctx.riskScores.map(r => ({ name: r.industryName, district: r.district, totalRisk: r.totalRisk, level: r.riskLevel })), null, 2)}

ACTIVE ESCALATIONS:
${JSON.stringify(ctx.escalations.filter(e => e.status !== 'Resolved'), null, 2)}

UNACKNOWLEDGED ALERTS:
${JSON.stringify(ctx.autoAlerts, null, 2)}

RESPONSE GUIDELINES:
- Be concise and precise. Lead with the direct answer.
- For what-if simulations: show before/after numbers, time to recovery, and confidence level
- For shutdowns: calculate total AQI relief = sum of each shut industry's contribution
- Format numbers clearly. Use ± for uncertainty ranges.
- End simulations with: "⚠ This is a model estimate (±15% confidence). Actual outcomes depend on meteorological conditions."
- Keep responses under 400 words unless a detailed breakdown is requested.
- For role=${userRole}: ${userRole === 'Industry User' ? 'Focus on their own compliance, forecasts, and what they can do to reduce their risk.' : 'Provide full cross-industry and cross-district analysis.'}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: 'Anthropic API error', detail: err }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.find((b: any) => b.type === 'text')?.text ?? '';
    return NextResponse.json({ reply: text });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
