// ─────────────────────────────────────────────────────────────────────────────
// complaintStore — localStorage-based complaint persistence
// Citizens write; Staff (Admin/RO) read and update status.
// Key: 'pvn_complaints'
// ─────────────────────────────────────────────────────────────────────────────

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned to RO'
  | 'Inspection Ordered'
  | 'Resolved';

export type ComplaintCategory =
  | 'Air Pollution'
  | 'Water Pollution'
  | 'Noise Pollution'
  | 'Illegal Dumping'
  | 'Other';

export interface Complaint {
  id: string;
  refNo: string;
  category: ComplaintCategory;
  location: string;
  district: string;
  description: string;
  submittedBy: string;        // name or 'Anonymous'
  submitterEmail?: string;    // optional — used for citizen tracking
  photoBase64?: string;       // optional photo
  submittedAt: string;        // ISO string
  status: ComplaintStatus;
  assignedRO?: string;
  actionNote?: string;
  resolvedAt?: string;
  priority: 'low' | 'medium' | 'high';
}

const STORE_KEY = 'pvn_complaints';

// District → RO mapping (mirrors existing data)
const DISTRICT_RO: Record<string, string> = {
  Nagpur:      'Rajesh Kumar',
  Amravati:    'Rajesh Kumar',
  Chandrapur:  'Rajesh Kumar',
  Akola:       'Rajesh Kumar',
  Yavatmal:    'Rajesh Kumar',
  Gondia:      'Rajesh Kumar',
  Pune:        'Anita Sharma',
  Mumbai:      'Anita Sharma',
  Thane:       'Anita Sharma',
  'Navi Mumbai':'Anita Sharma',
  Nashik:      'Anita Sharma',
  Aurangabad:  'Anita Sharma',
  Solapur:     'Anita Sharma',
  Kolhapur:    'Anita Sharma',
  Satara:      'Anita Sharma',
  Latur:       'Anita Sharma',
  Ratnagiri:   'Anita Sharma',
  Osmanabad:   'Anita Sharma',
  Amravati2:   'Rajesh Kumar',
  Jalgaon:     'Anita Sharma',
};

function priorityFromCategory(cat: ComplaintCategory, desc: string): Complaint['priority'] {
  const urgentWords = ['fire','smoke','chemical','toxic','black','dead fish','dying','hospital','emergency','burning'];
  const lower = desc.toLowerCase();
  if (urgentWords.some(w => lower.includes(w))) return 'high';
  if (cat === 'Air Pollution' || cat === 'Water Pollution') return 'medium';
  return 'low';
}

function genRef(): string {
  const d = new Date();
  return `PVN-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;
}

export function getComplaints(): Complaint[] {
  if (typeof window === 'undefined') return SEED_COMPLAINTS;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      // First time: seed with sample data
      localStorage.setItem(STORE_KEY, JSON.stringify(SEED_COMPLAINTS));
      return SEED_COMPLAINTS;
    }
    return JSON.parse(raw) as Complaint[];
  } catch {
    return SEED_COMPLAINTS;
  }
}

export function saveComplaints(complaints: Complaint[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, JSON.stringify(complaints));
}

export function addComplaint(input: {
  category: ComplaintCategory;
  location: string;
  district: string;
  description: string;
  submittedBy: string;
  submitterEmail?: string;
  photoBase64?: string;
}): Complaint {
  const complaint: Complaint = {
    id:             `CMP${Date.now()}`,
    refNo:          genRef(),
    category:       input.category,
    location:       input.location,
    district:       input.district,
    description:    input.description,
    submittedBy:    input.submittedBy || 'Anonymous',
    submitterEmail: input.submitterEmail,
    photoBase64:    input.photoBase64,
    submittedAt:    new Date().toISOString(),
    status:         'Submitted',
    assignedRO:     DISTRICT_RO[input.district],
    priority:       priorityFromCategory(input.category, input.description),
  };
  const existing = getComplaints();
  saveComplaints([complaint, ...existing]);
  return complaint;
}

export function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  actionNote?: string
): void {
  const all = getComplaints();
  const updated = all.map(c => {
    if (c.id !== id) return c;
    return {
      ...c,
      status,
      actionNote: actionNote || c.actionNote,
      resolvedAt: status === 'Resolved' ? new Date().toLocaleDateString('en-IN') : c.resolvedAt,
    };
  });
  saveComplaints(updated);
}

export function getComplaintsByEmail(email: string): Complaint[] {
  return getComplaints().filter(c => c.submitterEmail === email);
}

// ── Seed data (shown before any real submissions) ─────────────────────────────
const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP_SEED_1', refNo: 'PVN-2026-0312-0001',
    category: 'Air Pollution', location: 'Near Butibori MIDC gate, Nagpur',
    district: 'Nagpur', description: 'Black smoke from factory chimney since 3 days. Very difficult to breathe outside. Children coughing.',
    submittedBy: 'Priya Nair', submittedAt: '2026-03-12T10:15:00.000Z',
    status: 'Inspection Ordered', assignedRO: 'Rajesh Kumar',
    actionNote: 'Inspection scheduled for 16 Mar. Industry issued prior notice.', priority: 'high',
  },
  {
    id: 'CMP_SEED_2', refNo: 'PVN-2026-0310-0002',
    category: 'Water Pollution', location: 'Mula River bank near Aundh bridge, Pune',
    district: 'Pune', description: 'Dark liquid discharged into river from outlet pipe. Foul smell. Foam on river surface.',
    submittedBy: 'Anonymous', submittedAt: '2026-03-10T07:45:00.000Z',
    status: 'Under Review', assignedRO: 'Anita Sharma', priority: 'high',
  },
  {
    id: 'CMP_SEED_3', refNo: 'PVN-2026-0308-0003',
    category: 'Noise Pollution', location: 'Bandra Reclamation, Mumbai',
    district: 'Mumbai', description: 'Construction and DJ music past 11 PM. Sleep impossible for 2 weeks.',
    submittedBy: 'Rahul Sharma', submittedAt: '2026-03-08T23:30:00.000Z',
    status: 'Assigned to RO', assignedRO: 'Anita Sharma', priority: 'medium',
  },
  {
    id: 'CMP_SEED_4', refNo: 'PVN-2026-0305-0004',
    category: 'Air Pollution', location: 'Chikalthana Industrial Area, Aurangabad',
    district: 'Aurangabad', description: 'Dust and particulates from construction site affecting residential area. Eyes burning.',
    submittedBy: 'Meena Patil', submittedAt: '2026-03-05T15:20:00.000Z',
    status: 'Resolved', assignedRO: 'Anita Sharma',
    actionNote: 'Site visited. Contractor warned. Dust suppression installed.',
    resolvedAt: '12 Mar 2026', priority: 'low',
  },
];
