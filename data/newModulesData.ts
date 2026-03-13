// ─────────────────────────────────────────────────────────────────────────────
// Data for 6 new modules — never imported by existing pages
// ─────────────────────────────────────────────────────────────────────────────

import { INDUSTRIES, STATIONS, PRESCRIBED_LIMITS } from './mockData';

// ── 1. RISK SCORING ───────────────────────────────────────────────────────────
export interface RiskScore {
  industryId: string;
  industryName: string;
  district: string;
  type: string;
  assignedRO: string;
  contactPerson: string;
  currentSo2: number;
  currentNo2: number;
  currentPm25: number;
  complianceRate: number;
  // Computed risk components
  emissionScore: number;    // 0-100: how far above limits
  proximityScore: number;   // 0-100: closeness to population centres
  trendScore: number;       // 0-100: worsening trend penalty
  totalRisk: number;        // 0-100: composite
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  lastUpdated: string;
}

function computeRisk(ind: typeof INDUSTRIES[0]): RiskScore {
  const so2Ratio  = ind.currentSo2  / PRESCRIBED_LIMITS.so2;
  const no2Ratio  = ind.currentNo2  / PRESCRIBED_LIMITS.no2;
  const pm25Ratio = ind.currentPm25 / PRESCRIBED_LIMITS.pm25;
  const emissionScore = Math.min(100, Math.round(((so2Ratio + no2Ratio + pm25Ratio) / 3) * 60));

  // Simple proximity proxy: industries with lower compliance near dense districts score higher
  const denseDistricts = ['Mumbai', 'Pune', 'Nagpur', 'Thane'];
  const proximityScore = denseDistricts.includes(ind.district) ? 80 : 45;

  // Trend: count recent non-compliant days
  const recentBad = ind.history.filter(h => h.so2 > PRESCRIBED_LIMITS.so2).length;
  const trendScore = Math.min(100, recentBad * 14);

  const totalRisk = Math.min(100, Math.round(
    emissionScore * 0.5 + proximityScore * 0.25 + trendScore * 0.25
  ));

  const riskLevel: RiskScore['riskLevel'] =
    totalRisk >= 80 ? 'Critical' :
    totalRisk >= 60 ? 'High' :
    totalRisk >= 35 ? 'Medium' : 'Low';

  return {
    industryId: ind.id,
    industryName: ind.name,
    district: ind.district,
    type: ind.type,
    assignedRO: ind.assignedRO,
    contactPerson: ind.contactPerson,
    currentSo2: ind.currentSo2,
    currentNo2: ind.currentNo2,
    currentPm25: ind.currentPm25,
    complianceRate: ind.complianceRate,
    emissionScore,
    proximityScore,
    trendScore,
    totalRisk,
    riskLevel,
    lastUpdated: '14 Mar 2026, 01:30 AM',
  };
}

export const RISK_SCORES: RiskScore[] = INDUSTRIES
  .map(computeRisk)
  .sort((a, b) => b.totalRisk - a.totalRisk);

// ── 2. ESCALATION WORKFLOW ───────────────────────────────────────────────────
export type EscalationStatus = 'Open' | 'Acknowledged' | 'In Progress' | 'Escalated' | 'Resolved';
export type EscalationLevel  = 'Warning' | 'Notice' | 'Show Cause' | 'Closure Recommended';

export interface EscalationCase {
  id: string;
  industryId: string;
  industryName: string;
  district: string;
  assignedRO: string;
  pollutant: string;
  currentValue: number;
  limit: number;
  unit: string;
  daysExceeded: number;
  level: EscalationLevel;
  status: EscalationStatus;
  openedAt: string;
  deadline: string;            // RO must act by
  acknowledgedAt?: string;
  actionNote?: string;
  escalatedToAdmin: boolean;
}

export const ESCALATION_CASES: EscalationCase[] = [
  {
    id: 'ESC001', industryId: 'IND001', industryName: 'Bharat Steel Works',
    district: 'Nagpur', assignedRO: 'Rajesh Kumar',
    pollutant: 'SO₂', currentValue: 142, limit: 80, unit: 'ppm',
    daysExceeded: 7, level: 'Show Cause', status: 'Open',
    openedAt: '8 Mar 2026', deadline: '15 Mar 2026',
    escalatedToAdmin: true,
  },
  {
    id: 'ESC002', industryId: 'IND002', industryName: 'Maharashtra Textiles Ltd',
    district: 'Pune', assignedRO: 'Anita Sharma',
    pollutant: 'NO₂', currentValue: 68, limit: 60, unit: 'ppm',
    daysExceeded: 3, level: 'Notice', status: 'Acknowledged',
    openedAt: '10 Mar 2026', deadline: '17 Mar 2026',
    acknowledgedAt: '11 Mar 2026',
    actionNote: 'Sent formal notice. Awaiting corrective action plan.',
    escalatedToAdmin: false,
  },
  {
    id: 'ESC003', industryId: 'IND001', industryName: 'Bharat Steel Works',
    district: 'Nagpur', assignedRO: 'Rajesh Kumar',
    pollutant: 'PM2.5', currentValue: 104, limit: 60, unit: 'µg/m³',
    daysExceeded: 5, level: 'Notice', status: 'In Progress',
    openedAt: '9 Mar 2026', deadline: '16 Mar 2026',
    acknowledgedAt: '10 Mar 2026',
    actionNote: 'Inspection scheduled for 16 Mar.',
    escalatedToAdmin: false,
  },
  {
    id: 'ESC004', industryId: 'IND002', industryName: 'Maharashtra Textiles Ltd',
    district: 'Pune', assignedRO: 'Anita Sharma',
    pollutant: 'Missing Monthly Report', currentValue: 0, limit: 0, unit: '',
    daysExceeded: 14, level: 'Warning', status: 'Open',
    openedAt: '1 Mar 2026', deadline: '14 Mar 2026',
    escalatedToAdmin: false,
  },
];

// ── 3. ALERT RULES ────────────────────────────────────────────────────────────
export interface AlertRule {
  id: string;
  name: string;
  pollutant: string;
  threshold: number;
  unit: string;
  domain: 'air' | 'water' | 'noise';
  severity: 'info' | 'warning' | 'critical';
  notifyRoles: string[];
  active: boolean;
}

export const ALERT_RULES: AlertRule[] = [
  { id:'R001', name:'SO₂ Breach',        pollutant:'SO₂',  threshold:80,  unit:'ppm',    domain:'air',   severity:'critical', notifyRoles:['Super Admin','Regional Officer'], active:true  },
  { id:'R002', name:'AQI > 200',         pollutant:'AQI',  threshold:200, unit:'',       domain:'air',   severity:'critical', notifyRoles:['Super Admin','Regional Officer'], active:true  },
  { id:'R003', name:'AQI Elevated',      pollutant:'AQI',  threshold:100, unit:'',       domain:'air',   severity:'warning',  notifyRoles:['Regional Officer'],                active:true  },
  { id:'R004', name:'PM2.5 Breach',      pollutant:'PM2.5',threshold:60,  unit:'µg/m³',  domain:'air',   severity:'critical', notifyRoles:['Super Admin','Regional Officer'], active:true  },
  { id:'R005', name:'Water Critical',    pollutant:'DO',   threshold:2,   unit:'mg/L',   domain:'water', severity:'critical', notifyRoles:['Super Admin'],                    active:true  },
  { id:'R006', name:'Water Poor DO',     pollutant:'DO',   threshold:4,   unit:'mg/L',   domain:'water', severity:'warning',  notifyRoles:['Regional Officer'],                active:true  },
  { id:'R007', name:'Industrial Noise',  pollutant:'Noise',threshold:75,  unit:'dB(A)',  domain:'noise', severity:'warning',  notifyRoles:['Regional Officer'],                active:true  },
  { id:'R008', name:'Noise Breach',      pollutant:'Noise',threshold:80,  unit:'dB(A)',  domain:'noise', severity:'critical', notifyRoles:['Super Admin','Regional Officer'], active:false },
];

export interface AutoAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  stationName: string;
  district: string;
  triggeredValue: number;
  threshold: number;
  unit: string;
  severity: 'info' | 'warning' | 'critical';
  firedAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  domain: 'air' | 'water' | 'noise';
}

export const AUTO_ALERTS: AutoAlert[] = [
  { id:'AL001', ruleId:'R001', ruleName:'SO₂ Breach',       stationName:'Nagpur Butibori MIDC', district:'Nagpur', triggeredValue:156, threshold:80,  unit:'ppm',    severity:'critical', firedAt:'14 Mar 2026 01:25 AM', acknowledged:false, domain:'air'   },
  { id:'AL002', ruleId:'R002', ruleName:'AQI > 200',         stationName:'Hadapsar Industrial',  district:'Pune',   triggeredValue:241, threshold:200, unit:'',       severity:'critical', firedAt:'14 Mar 2026 01:32 AM', acknowledged:false, domain:'air'   },
  { id:'AL003', ruleId:'R004', ruleName:'PM2.5 Breach',      stationName:'Andheri East CAAQMS', district:'Mumbai', triggeredValue:78,  threshold:60,  unit:'µg/m³',  severity:'critical', firedAt:'14 Mar 2026 01:30 AM', acknowledged:false, domain:'air'   },
  { id:'AL004', ruleId:'R005', ruleName:'Water Critical DO', stationName:'Nag River — Nagpur',  district:'Nagpur', triggeredValue:1.9, threshold:2,   unit:'mg/L',   severity:'critical', firedAt:'14 Mar 2026 08:45 AM', acknowledged:true,  acknowledgedBy:'Super Admin', domain:'water' },
  { id:'AL005', ruleId:'R003', ruleName:'AQI Elevated',      stationName:'Thane Creek Zone',    district:'Thane',  triggeredValue:162, threshold:100, unit:'',       severity:'warning',  firedAt:'14 Mar 2026 01:18 AM', acknowledged:true,  acknowledgedBy:'Rajesh Kumar', domain:'air'  },
  { id:'AL006', ruleId:'R007', ruleName:'Industrial Noise',  stationName:'Dharavi Industrial',  district:'Mumbai', triggeredValue:81,  threshold:75,  unit:'dB(A)',  severity:'warning',  firedAt:'14 Mar 2026 01:30 AM', acknowledged:false, domain:'noise' },
];

// ── 4. COMPLIANCE CALENDAR ────────────────────────────────────────────────────
export type CalendarEventType = 'report_due' | 'inspection' | 'festival' | 'deadline' | 'hearing';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;           // YYYY-MM-DD
  type: CalendarEventType;
  industry?: string;
  district?: string;
  assignedRO?: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  completed: boolean;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id:'CE001', title:'Monthly Reports Due',          date:'2026-03-31', type:'report_due',  priority:'high',   description:'All registered industries must submit March 2026 monthly emissions report.', completed:false },
  { id:'CE002', title:'Bharat Steel — SO₂ Hearing',   date:'2026-03-20', type:'hearing',     industry:'Bharat Steel Works', district:'Nagpur', assignedRO:'Rajesh Kumar', priority:'high', description:'Show-cause hearing for sustained SO₂ breach over 7 days.', completed:false },
  { id:'CE003', title:'Pune Chemicals Inspection',    date:'2026-03-18', type:'inspection',  industry:'Pune Chemicals Co.', district:'Pune', assignedRO:'Anita Sharma', priority:'medium', description:'Scheduled quarterly inspection of pollution control systems.', completed:false },
  { id:'CE004', title:'Gudi Padwa — Festival Period', date:'2026-03-30', type:'festival',    priority:'high',   description:'Festival period: temporary emission limits apply. Top-risk units must reduce output by 20%.', completed:false },
  { id:'CE005', title:'Maharashtra Textiles Reminder',date:'2026-03-15', type:'deadline',    industry:'Maharashtra Textiles Ltd', district:'Pune', assignedRO:'Anita Sharma', priority:'medium', description:'ESC004: Missing monthly report deadline. Final reminder before escalation.', completed:false },
  { id:'CE006', title:'Daily Reports Due',            date:'2026-03-14', type:'report_due',  priority:'low',    description:'Daily emissions data submission for all CAAQMS-monitored industries.', completed:false },
  { id:'CE007', title:'Quarterly MPCB Review',        date:'2026-04-05', type:'hearing',     priority:'high',   description:'Q1 2026 performance review with Maharashtra SPCB board. All ROs must present district summaries.', completed:false },
  { id:'CE008', title:'Nagpur Butibori Inspection',   date:'2026-03-16', type:'inspection',  district:'Nagpur', assignedRO:'Rajesh Kumar', priority:'high', description:'Emergency inspection ordered due to ESC001 breach.', completed:false },
  { id:'CE009', title:'April Monthly Reports Due',    date:'2026-04-30', type:'report_due',  priority:'medium', description:'April 2026 monthly reports deadline.', completed:false },
  { id:'CE010', title:'Holi — Festival Advisory',     date:'2026-03-14', type:'festival',    priority:'medium', description:'Holi festival: monitor particulate levels. Issue public advisory if AQI crosses 200.', completed:false },
];

// ── 5. CITIZEN COMPLAINTS ─────────────────────────────────────────────────────
export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Assigned to RO' | 'Inspection Ordered' | 'Resolved';
export type ComplaintCategory = 'Air Pollution' | 'Water Pollution' | 'Noise Pollution' | 'Illegal Dumping' | 'Other';

export interface CitizenComplaint {
  id: string;
  refNo: string;
  category: ComplaintCategory;
  description: string;
  location: string;
  district: string;
  submittedBy: string;       // name (anonymous option)
  submittedAt: string;
  status: ComplaintStatus;
  assignedRO?: string;
  actionNote?: string;
  resolvedAt?: string;
  priority: 'low' | 'medium' | 'high';
}

export const COMPLAINTS: CitizenComplaint[] = [
  {
    id:'CMP001', refNo:'PVN-2026-0312-001',
    category:'Air Pollution', district:'Nagpur',
    location:'Near Butibori MIDC gate, Nagpur',
    description:'Black smoke coming from factory chimney since past 3 days. Very difficult to breathe outside. Children are coughing.',
    submittedBy:'Priya Nair', submittedAt:'12 Mar 2026 10:15 AM',
    status:'Inspection Ordered', assignedRO:'Rajesh Kumar',
    actionNote:'Inspection scheduled for 16 Mar. Industry issued prior notice.',
    priority:'high',
  },
  {
    id:'CMP002', refNo:'PVN-2026-0310-002',
    category:'Water Pollution', district:'Pune',
    location:'Mula River bank near Aundh bridge, Pune',
    description:'Dark coloured liquid being discharged into river from an outlet pipe. Foul smell. River surface has foam.',
    submittedBy:'Anonymous', submittedAt:'10 Mar 2026 07:45 AM',
    status:'Under Review', priority:'high',
  },
  {
    id:'CMP003', refNo:'PVN-2026-0308-003',
    category:'Noise Pollution', district:'Mumbai',
    location:'Near DJ event, Bandra Reclamation',
    description:'Construction and DJ music at night past 11 PM. Sleep is impossible. This has been happening for 2 weeks.',
    submittedBy:'Rahul Sharma', submittedAt:'8 Mar 2026 11:30 PM',
    status:'Assigned to RO', assignedRO:'Anita Sharma',
    priority:'medium',
  },
  {
    id:'CMP004', refNo:'PVN-2026-0305-004',
    category:'Air Pollution', district:'Aurangabad',
    location:'Chikalthana Industrial Area, Aurangabad',
    description:'Dust and particulates from construction site affecting residential area. Eyes burning, sneezing.',
    submittedBy:'Meena Patil', submittedAt:'5 Mar 2026 03:20 PM',
    status:'Resolved', assignedRO:'Anita Sharma',
    actionNote:'Site visited. Construction contractor warned. Dust suppression measures installed.',
    resolvedAt:'12 Mar 2026',
    priority:'low',
  },
  {
    id:'CMP005', refNo:'PVN-2026-0301-005',
    category:'Illegal Dumping', district:'Thane',
    location:'Thane Creek bank near Airoli bridge',
    description:'Industrial waste drums dumped near the creek. Liquid leaking into water. Strong chemical smell.',
    submittedBy:'Anonymous', submittedAt:'1 Mar 2026 08:00 AM',
    status:'Under Review', priority:'high',
  },
];

// ── 6. AI COPILOT context data (exported for the API route) ──────────────────
export const COPILOT_CONTEXT = {
  industries: INDUSTRIES.map(i => ({
    id: i.id, name: i.name, type: i.type, district: i.district,
    assignedRO: i.assignedRO, complianceRate: i.complianceRate,
    currentSo2: i.currentSo2, currentNo2: i.currentNo2, currentPm25: i.currentPm25,
    sevenDayHistory: i.history,
  })),
  stations: STATIONS.map(s => ({
    id: s.id, name: s.name, district: s.district,
    aqi: s.aqi, so2: s.so2, no2: s.no2, pm25: s.pm25, status: s.status,
  })),
  prescribedLimits: PRESCRIBED_LIMITS,
  riskScores: RISK_SCORES,
  escalations: ESCALATION_CASES,
  autoAlerts: AUTO_ALERTS.filter(a => !a.acknowledged),
};
