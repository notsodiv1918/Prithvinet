// ─────────────────────────────────────────────────────────────────────────────
// Citizen-facing map data — separate datasets for Air, Water, Noise
// Never imported by admin/RO/industry pages
// ─────────────────────────────────────────────────────────────────────────────

// ── AIR ── 20 stations across Maharashtra with AQI, PM2.5, PM10, NO₂, SO₂, O₃
export interface AirStation {
  id: string; name: string; district: string;
  lat: number; lng: number;
  aqi: number; pm25: number; pm10: number; no2: number; so2: number; o3: number;
  status: 'good' | 'moderate' | 'poor' | 'hazardous';
  updated: string;
}

export const AIR_STATIONS: AirStation[] = [
  { id:'A01', name:'Andheri East — CAAQMS',      district:'Mumbai',      lat:19.1136, lng:72.8697, aqi:218, pm25:78,  pm10:112, no2:74,  so2:92,  o3:48,  status:'poor',      updated:'14 Mar, 1:30 AM' },
  { id:'A02', name:'Worli Sea Face',              district:'Mumbai',      lat:18.9980, lng:72.8172, aqi:156, pm25:52,  pm10:88,  no2:61,  so2:44,  o3:38,  status:'poor',      updated:'14 Mar, 1:28 AM' },
  { id:'A03', name:'Bandra Kurla Complex',        district:'Mumbai',      lat:19.0596, lng:72.8656, aqi:145, pm25:49,  pm10:81,  no2:55,  so2:38,  o3:34,  status:'moderate',  updated:'14 Mar, 1:25 AM' },
  { id:'A04', name:'Hadapsar Industrial Zone',    district:'Pune',        lat:18.5018, lng:73.9258, aqi:241, pm25:91,  pm10:138, no2:82,  so2:138, o3:52,  status:'poor',      updated:'14 Mar, 1:32 AM' },
  { id:'A05', name:'Shivajinagar — Pune City',   district:'Pune',        lat:18.5308, lng:73.8474, aqi:118, pm25:41,  pm10:68,  no2:49,  so2:28,  o3:29,  status:'moderate',  updated:'14 Mar, 1:30 AM' },
  { id:'A06', name:'Butibori MIDC',               district:'Nagpur',      lat:21.0114, lng:79.1082, aqi:267, pm25:104, pm10:162, no2:94,  so2:156, o3:61,  status:'hazardous', updated:'14 Mar, 1:25 AM' },
  { id:'A07', name:'Sadar — Nagpur Central',      district:'Nagpur',      lat:21.1458, lng:79.0882, aqi:132, pm25:44,  pm10:72,  no2:52,  so2:41,  o3:31,  status:'moderate',  updated:'14 Mar, 1:27 AM' },
  { id:'A08', name:'Nashik Road Station',         district:'Nashik',      lat:19.9975, lng:73.7898, aqi:128, pm25:43,  pm10:70,  no2:48,  so2:38,  o3:28,  status:'moderate',  updated:'14 Mar, 1:22 AM' },
  { id:'A09', name:'Aurangabad CIDCO',            district:'Aurangabad',  lat:19.8762, lng:75.3433, aqi:87,  pm25:28,  pm10:46,  no2:28,  so2:19,  o3:22,  status:'moderate',  updated:'14 Mar, 1:20 AM' },
  { id:'A10', name:'Thane Creek Zone',            district:'Thane',       lat:19.2183, lng:72.9781, aqi:162, pm25:58,  pm10:94,  no2:62,  so2:54,  o3:41,  status:'poor',      updated:'14 Mar, 1:18 AM' },
  { id:'A11', name:'Kolhapur Shiroli MIDC',       district:'Kolhapur',    lat:16.7050, lng:74.2433, aqi:72,  pm25:22,  pm10:38,  no2:24,  so2:16,  o3:18,  status:'good',      updated:'14 Mar, 1:15 AM' },
  { id:'A12', name:'Solapur Industrial Zone',     district:'Solapur',     lat:17.6805, lng:75.9064, aqi:94,  pm25:31,  pm10:52,  no2:36,  so2:28,  o3:24,  status:'moderate',  updated:'14 Mar, 1:12 AM' },
  { id:'A13', name:'Navi Mumbai Turbhe',          district:'Navi Mumbai', lat:19.0771, lng:73.0183, aqi:78,  pm25:24,  pm10:41,  no2:27,  so2:18,  o3:19,  status:'good',      updated:'14 Mar, 1:10 AM' },
  { id:'A14', name:'Amravati Cotton Market',      district:'Amravati',    lat:20.9373, lng:77.7796, aqi:108, pm25:36,  pm10:60,  no2:41,  so2:24,  o3:26,  status:'moderate',  updated:'14 Mar, 1:08 AM' },
  { id:'A15', name:'Latur Bus Stand Area',        district:'Latur',       lat:18.4088, lng:76.5604, aqi:82,  pm25:26,  pm10:44,  no2:29,  so2:18,  o3:21,  status:'good',      updated:'14 Mar, 1:06 AM' },
  { id:'A16', name:'Ratnagiri Port Area',         district:'Ratnagiri',   lat:16.9944, lng:73.3120, aqi:48,  pm25:14,  pm10:26,  no2:16,  so2:9,   o3:14,  status:'good',      updated:'14 Mar, 1:04 AM' },
  { id:'A17', name:'Chandrapur MIDC Gate',        district:'Chandrapur',  lat:19.9615, lng:79.2961, aqi:188, pm25:68,  pm10:104, no2:72,  so2:98,  o3:44,  status:'poor',      updated:'14 Mar, 1:02 AM' },
  { id:'A18', name:'Jalgaon City Centre',         district:'Jalgaon',     lat:21.0077, lng:75.5626, aqi:96,  pm25:32,  pm10:54,  no2:38,  so2:22,  o3:25,  status:'moderate',  updated:'14 Mar, 1:00 AM' },
  { id:'A19', name:'Akola Railway Station',       district:'Akola',       lat:20.7002, lng:77.0082, aqi:114, pm25:39,  pm10:64,  no2:44,  so2:32,  o3:28,  status:'moderate',  updated:'14 Mar, 0:58 AM' },
  { id:'A20', name:'Yavatmal Agriculture Zone',   district:'Yavatmal',    lat:20.3888, lng:78.1204, aqi:61,  pm25:18,  pm10:32,  no2:21,  so2:12,  o3:16,  status:'good',      updated:'14 Mar, 0:56 AM' },
];

// ── WATER ── 18 stations with lat/lng added
export interface WaterStation {
  id: string; name: string; body: string; district: string;
  lat: number; lng: number;
  ph: number; dissolvedOxygen: number; bod: number; turbidity: number; coliform: number; tds: number;
  quality: 'Good' | 'Moderate' | 'Poor' | 'Critical';
  trend: 'improving' | 'stable' | 'worsening';
  updated: string;
}

export const WATER_MAP_STATIONS: WaterStation[] = [
  { id:'W01', name:'Mithi River — Dharavi',       body:'Mithi River',        district:'Mumbai',      lat:19.0380, lng:72.8512, ph:6.1, dissolvedOxygen:2.8,  bod:18.4, turbidity:12.5, coliform:2400, tds:820, quality:'Critical',  trend:'worsening', updated:'Today 9:00 AM' },
  { id:'W02', name:'Ulhas River — Ambarnath',     body:'Ulhas River',        district:'Thane',       lat:19.2183, lng:73.1882, ph:6.5, dissolvedOxygen:3.8,  bod:9.4,  turbidity:5.6,  coliform:710,  tds:620, quality:'Poor',     trend:'worsening', updated:'Today 9:10 AM' },
  { id:'W03', name:'Mula-Mutha — Pune Deccan',    body:'Mula-Mutha River',   district:'Pune',        lat:18.5204, lng:73.8567, ph:6.8, dissolvedOxygen:4.2,  bod:8.6,  turbidity:4.8,  coliform:580,  tds:540, quality:'Poor',     trend:'worsening', updated:'Today 9:15 AM' },
  { id:'W04', name:'Pawna Lake — Lonavala',       body:'Pawna Lake',         district:'Pune',        lat:18.6880, lng:73.4831, ph:7.6, dissolvedOxygen:8.2,  bod:0.8,  turbidity:0.5,  coliform:12,   tds:185, quality:'Good',     trend:'improving', updated:'Today 8:30 AM' },
  { id:'W05', name:'Nag River — Nagpur Central',  body:'Nag River',          district:'Nagpur',      lat:21.1458, lng:79.0882, ph:5.9, dissolvedOxygen:1.9,  bod:24.1, turbidity:18.2, coliform:3100, tds:960, quality:'Critical',  trend:'worsening', updated:'Today 8:45 AM' },
  { id:'W06', name:'Wardha River — Wardha',       body:'Wardha River',       district:'Amravati',    lat:20.7454, lng:78.6022, ph:7.3, dissolvedOxygen:7.4,  bod:1.2,  turbidity:0.8,  coliform:28,   tds:220, quality:'Good',     trend:'stable',    updated:'Today 8:50 AM' },
  { id:'W07', name:'Godavari — Nashik Ghats',     body:'Godavari River',     district:'Nashik',      lat:20.0059, lng:73.7716, ph:7.4, dissolvedOxygen:6.8,  bod:2.1,  turbidity:1.4,  coliform:95,   tds:310, quality:'Moderate',  trend:'stable',    updated:'Today 9:00 AM' },
  { id:'W08', name:'Bhima River — Pandharpur',    body:'Bhima River',        district:'Solapur',     lat:17.6805, lng:75.3297, ph:7.1, dissolvedOxygen:5.0,  bod:5.2,  turbidity:3.1,  coliform:320,  tds:490, quality:'Poor',     trend:'stable',    updated:'Today 9:30 AM' },
  { id:'W09', name:'Venna Lake — Mahabaleshwar',  body:'Venna Lake',         district:'Satara',      lat:17.9307, lng:73.6477, ph:7.5, dissolvedOxygen:7.9,  bod:0.6,  turbidity:0.4,  coliform:8,    tds:160, quality:'Good',     trend:'improving', updated:'Today 9:00 AM' },
  { id:'W10', name:'Koyna River — Karad',         body:'Koyna River',        district:'Satara',      lat:17.2930, lng:74.1830, ph:7.4, dissolvedOxygen:8.1,  bod:0.9,  turbidity:0.6,  coliform:14,   tds:190, quality:'Good',     trend:'stable',    updated:'Today 9:05 AM' },
  { id:'W11', name:'Vashishthi River — Chiplun',  body:'Vashishthi River',   district:'Ratnagiri',   lat:17.5330, lng:73.5140, ph:7.2, dissolvedOxygen:6.1,  bod:2.8,  turbidity:1.9,  coliform:142,  tds:275, quality:'Moderate',  trend:'stable',    updated:'Today 9:20 AM' },
  { id:'W12', name:'Purna River — Akola',         body:'Purna River',        district:'Akola',       lat:20.7117, lng:77.0041, ph:7.0, dissolvedOxygen:5.8,  bod:3.9,  turbidity:2.4,  coliform:210,  tds:380, quality:'Moderate',  trend:'stable',    updated:'Today 9:25 AM' },
  { id:'W13', name:'Penganga — Yavatmal',         body:'Penganga River',     district:'Yavatmal',    lat:20.2450, lng:78.5120, ph:7.1, dissolvedOxygen:6.4,  bod:2.2,  turbidity:1.2,  coliform:88,   tds:245, quality:'Moderate',  trend:'improving', updated:'Today 9:30 AM' },
  { id:'W14', name:'Irai Dam — Chandrapur',       body:'Irai Reservoir',     district:'Chandrapur',  lat:19.9900, lng:79.3600, ph:7.2, dissolvedOxygen:7.1,  bod:1.4,  turbidity:0.9,  coliform:32,   tds:205, quality:'Good',     trend:'stable',    updated:'Today 9:10 AM' },
  { id:'W15', name:'Godavari — Aurangabad',       body:'Godavari',           district:'Aurangabad',  lat:19.8762, lng:75.3200, ph:7.3, dissolvedOxygen:6.5,  bod:2.6,  turbidity:1.6,  coliform:118,  tds:290, quality:'Moderate',  trend:'stable',    updated:'Today 8:55 AM' },
  { id:'W16', name:'Wainganga — Gondia',          body:'Wainganga River',    district:'Gondia',      lat:21.4600, lng:80.1900, ph:7.4, dissolvedOxygen:7.8,  bod:1.0,  turbidity:0.7,  coliform:19,   tds:175, quality:'Good',     trend:'improving', updated:'Today 9:00 AM' },
  { id:'W17', name:'Panchganga — Kolhapur',       body:'Panchganga River',   district:'Kolhapur',    lat:16.7050, lng:74.2200, ph:6.7, dissolvedOxygen:4.8,  bod:6.8,  turbidity:4.2,  coliform:440,  tds:460, quality:'Poor',     trend:'worsening', updated:'Today 9:18 AM' },
  { id:'W18', name:'Terna River — Osmanabad',     body:'Terna River',        district:'Osmanabad',   lat:18.1860, lng:76.0390, ph:7.1, dissolvedOxygen:6.2,  bod:2.4,  turbidity:1.3,  coliform:102,  tds:260, quality:'Moderate',  trend:'stable',    updated:'Today 9:22 AM' },
];

// ── NOISE ── 18 zones with lat/lng
export interface NoiseStation {
  id: string; name: string; district: string; zone: 'Industrial' | 'Commercial' | 'Residential' | 'Silence';
  lat: number; lng: number;
  dayLevel: number; dayLimit: number;
  nightLevel: number; nightLimit: number;
  primarySource: string;
  status: 'safe' | 'warning' | 'breach';
  updated: string;
}

export const NOISE_MAP_STATIONS: NoiseStation[] = [
  { id:'N01', name:'Dharavi Industrial Area',     district:'Mumbai',      zone:'Industrial',   lat:19.0454, lng:72.8544, dayLevel:81, dayLimit:75, nightLevel:74, nightLimit:70, primarySource:'Manufacturing units',    status:'breach',  updated:'14 Mar, 1:30 AM' },
  { id:'N02', name:'Dadar Market',                district:'Mumbai',      zone:'Commercial',   lat:19.0178, lng:72.8478, dayLevel:72, dayLimit:65, nightLevel:58, nightLimit:55, primarySource:'Market & traffic',        status:'breach',  updated:'14 Mar, 1:28 AM' },
  { id:'N03', name:'Bandra West — Residential',   district:'Mumbai',      zone:'Residential',  lat:19.0544, lng:72.8335, dayLevel:59, dayLimit:55, nightLevel:48, nightLimit:45, primarySource:'Night-time traffic',      status:'warning', updated:'14 Mar, 1:25 AM' },
  { id:'N04', name:'Lilavati Hospital Zone',      district:'Mumbai',      zone:'Silence',      lat:19.0477, lng:72.8257, dayLevel:54, dayLimit:50, nightLevel:46, nightLimit:40, primarySource:'Ambulance & traffic',     status:'breach',  updated:'14 Mar, 1:22 AM' },
  { id:'N05', name:'Butibori MIDC',               district:'Nagpur',      zone:'Industrial',   lat:21.0114, lng:79.1082, dayLevel:78, dayLimit:75, nightLevel:68, nightLimit:70, primarySource:'Steel & heavy industry',  status:'warning', updated:'14 Mar, 1:25 AM' },
  { id:'N06', name:'Civil Lines — Nagpur',        district:'Nagpur',      zone:'Residential',  lat:21.1458, lng:79.0882, dayLevel:52, dayLimit:55, nightLevel:41, nightLimit:45, primarySource:'Traffic',                 status:'safe',    updated:'14 Mar, 1:27 AM' },
  { id:'N07', name:'Hinjewadi IT Park',           district:'Pune',        zone:'Commercial',   lat:18.5913, lng:73.7389, dayLevel:63, dayLimit:65, nightLevel:50, nightLimit:55, primarySource:'Office traffic',          status:'safe',    updated:'14 Mar, 1:30 AM' },
  { id:'N08', name:'Baner Residential — Pune',    district:'Pune',        zone:'Residential',  lat:18.5591, lng:73.7868, dayLevel:61, dayLimit:55, nightLevel:49, nightLimit:45, primarySource:'Construction noise',      status:'breach',  updated:'14 Mar, 1:28 AM' },
  { id:'N09', name:'Thane Station Area',          district:'Thane',       zone:'Commercial',   lat:19.1815, lng:72.9783, dayLevel:67, dayLimit:65, nightLevel:53, nightLimit:55, primarySource:'Railway & traffic',       status:'warning', updated:'14 Mar, 1:18 AM' },
  { id:'N10', name:'Koparkhairane — Navi Mumbai', district:'Navi Mumbai', zone:'Residential',  lat:19.0981, lng:73.0169, dayLevel:54, dayLimit:55, nightLevel:42, nightLimit:45, primarySource:'Residential area',       status:'safe',    updated:'14 Mar, 1:10 AM' },
  { id:'N11', name:'Nashik Hospital Zone',        district:'Nashik',      zone:'Silence',      lat:20.0059, lng:73.7716, dayLevel:52, dayLimit:50, nightLevel:43, nightLimit:40, primarySource:'Traffic near hospital',   status:'breach',  updated:'14 Mar, 1:00 AM' },
  { id:'N12', name:'Aurangabad MIDC',             district:'Aurangabad',  zone:'Industrial',   lat:19.8762, lng:75.3633, dayLevel:76, dayLimit:75, nightLevel:69, nightLimit:70, primarySource:'Auto parts factories',    status:'warning', updated:'14 Mar, 0:58 AM' },
  { id:'N13', name:'Chandrapur Thermal Zone',     district:'Chandrapur',  zone:'Industrial',   lat:19.9615, lng:79.3161, dayLevel:84, dayLimit:75, nightLevel:78, nightLimit:70, primarySource:'Thermal power plant',     status:'breach',  updated:'14 Mar, 0:56 AM' },
  { id:'N14', name:'Kolhapur Market Area',        district:'Kolhapur',    zone:'Commercial',   lat:16.7050, lng:74.2433, dayLevel:64, dayLimit:65, nightLevel:51, nightLimit:55, primarySource:'Busy market street',     status:'safe',    updated:'14 Mar, 0:54 AM' },
  { id:'N15', name:'Solapur Railway Junction',    district:'Solapur',     zone:'Commercial',   lat:17.6805, lng:75.9164, dayLevel:69, dayLimit:65, nightLevel:58, nightLimit:55, primarySource:'Railway operations',      status:'warning', updated:'14 Mar, 0:52 AM' },
  { id:'N16', name:'Amravati University Zone',    district:'Amravati',    zone:'Silence',      lat:20.9373, lng:77.7596, dayLevel:48, dayLimit:50, nightLevel:38, nightLimit:40, primarySource:'Low activity zone',       status:'safe',    updated:'14 Mar, 0:50 AM' },
  { id:'N17', name:'Latur MIDC Industrial',       district:'Latur',       zone:'Industrial',   lat:18.4088, lng:76.5804, dayLevel:74, dayLimit:75, nightLevel:67, nightLimit:70, primarySource:'Light industry cluster',  status:'safe',    updated:'14 Mar, 0:48 AM' },
  { id:'N18', name:'Jalgaon Market Square',       district:'Jalgaon',     zone:'Commercial',   lat:21.0077, lng:75.5726, dayLevel:66, dayLimit:65, nightLevel:54, nightLimit:55, primarySource:'Market & vendors',        status:'warning', updated:'14 Mar, 0:46 AM' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
export function airColor(status: AirStation['status']): string {
  return status === 'good' ? '#16a34a' : status === 'moderate' ? '#ca8a04' : status === 'poor' ? '#ea580c' : '#991b1b';
}
export function waterColor(quality: WaterStation['quality']): string {
  return quality === 'Good' ? '#16a34a' : quality === 'Moderate' ? '#ca8a04' : quality === 'Poor' ? '#ea580c' : '#991b1b';
}
export function noiseColor(status: NoiseStation['status']): string {
  return status === 'safe' ? '#16a34a' : status === 'warning' ? '#ca8a04' : '#991b1b';
}

// Radius scales for heatmap-style circles
export function airRadius(aqi: number): number {
  if (aqi <= 50)  return 18000;
  if (aqi <= 100) return 22000;
  if (aqi <= 200) return 28000;
  return 34000;
}
export function waterRadius(quality: WaterStation['quality']): number {
  return quality === 'Good' ? 18000 : quality === 'Moderate' ? 22000 : quality === 'Poor' ? 28000 : 34000;
}
export function noiseRadius(dayLevel: number, dayLimit: number): number {
  const excess = dayLevel - dayLimit;
  if (excess <= 0)  return 14000;
  if (excess <= 5)  return 20000;
  if (excess <= 10) return 26000;
  return 32000;
}
