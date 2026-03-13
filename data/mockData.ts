export type StationStatus = 'safe' | 'warning' | 'breach';

export interface Station {
  id: string; name: string; district: string;
  lat: number; lng: number; aqi: number;
  so2: number; no2: number; pm25: number; noise: number;
  status: StationStatus; type: 'urban' | 'industrial' | 'rural';
  lastUpdated: string;
}

export interface DayReading {
  date: string; so2: number; no2: number; pm25: number; aqi: number; noise: number;
}

export interface Industry {
  id: string; name: string; type: string; district: string;
  lat: number; lng: number; contactPerson: string; phone: string;
  assignedRO: string; currentSo2: number; currentNo2: number; currentPm25: number;
  complianceRate: number; lastReport: string; history: DayReading[];
}

export interface Report {
  id: string; industry: string; type: 'Daily' | 'Monthly';
  date: string; parameters: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending'; submittedBy: string;
}

export interface User {
  id: number; name: string;
  role: 'Super Admin' | 'Regional Officer' | 'Monitoring Team' | 'Industry User' | 'Citizen';
  email: string; password: string; district?: string; redirect: string;
}

export const PRESCRIBED_LIMITS = { so2: 80, no2: 60, pm25: 60, noiseDay: 55, noiseNight: 45, aqi: 100 };

export const STATIONS: Station[] = [
  { id:'STN001', name:'Andheri East CAAQMS', district:'Mumbai', lat:19.1136, lng:72.8697, aqi:218, so2:92, no2:74, pm25:78, noise:68, status:'breach', type:'urban', lastUpdated:'2024-07-15 14:32' },
  { id:'STN002', name:'Bandra Kurla Complex', district:'Mumbai', lat:19.0596, lng:72.8656, aqi:145, so2:61, no2:55, pm25:52, noise:62, status:'warning', type:'urban', lastUpdated:'2024-07-15 14:30' },
  { id:'STN003', name:'Hadapsar Industrial Zone', district:'Pune', lat:18.5018, lng:73.9258, aqi:241, so2:138, no2:82, pm25:91, noise:71, status:'breach', type:'industrial', lastUpdated:'2024-07-15 14:28' },
  { id:'STN004', name:'Nagpur Butibori MIDC', district:'Nagpur', lat:21.0114, lng:79.1082, aqi:267, so2:156, no2:94, pm25:104, noise:74, status:'breach', type:'industrial', lastUpdated:'2024-07-15 14:25' },
  { id:'STN005', name:'Nashik Road Station', district:'Nashik', lat:19.9975, lng:73.7898, aqi:128, so2:58, no2:48, pm25:44, noise:54, status:'warning', type:'urban', lastUpdated:'2024-07-15 14:22' },
  { id:'STN006', name:'Aurangabad CIDCO', district:'Aurangabad', lat:19.8762, lng:75.3433, aqi:87, so2:34, no2:28, pm25:31, noise:48, status:'safe', type:'urban', lastUpdated:'2024-07-15 14:20' },
  { id:'STN007', name:'Thane Creek Zone', district:'Thane', lat:19.2183, lng:72.9781, aqi:162, so2:71, no2:58, pm25:61, noise:64, status:'warning', type:'industrial', lastUpdated:'2024-07-15 14:18' },
  { id:'STN008', name:'Kolhapur Shiroli', district:'Kolhapur', lat:16.7050, lng:74.2433, aqi:72, so2:28, no2:22, pm25:26, noise:44, status:'safe', type:'rural', lastUpdated:'2024-07-15 14:15' },
  { id:'STN009', name:'Solapur Industrial', district:'Solapur', lat:17.6805, lng:75.9064, aqi:94, so2:42, no2:36, pm25:38, noise:51, status:'safe', type:'industrial', lastUpdated:'2024-07-15 14:12' },
  { id:'STN010', name:'Navi Mumbai Turbhe', district:'Navi Mumbai', lat:19.0771, lng:73.0183, aqi:78, so2:31, no2:27, pm25:29, noise:46, status:'safe', type:'urban', lastUpdated:'2024-07-15 14:10' },
];

export const INDUSTRIES: Industry[] = [
  {
    id:'IND001', name:'Bharat Steel Works', type:'Steel Manufacturing', district:'Nagpur',
    lat:21.0214, lng:79.0982, contactPerson:'Suresh Patil', phone:'+91-712-2345678',
    assignedRO:'Rajesh Kumar', currentSo2:142, currentNo2:88, currentPm25:98,
    complianceRate:28, lastReport:'2024-07-15',
    history:[
      {date:'Jul 9',so2:148,no2:91,pm25:102,aqi:271,noise:76},
      {date:'Jul 10',so2:135,no2:84,pm25:96,aqi:258,noise:73},
      {date:'Jul 11',so2:152,no2:96,pm25:108,aqi:284,noise:78},
      {date:'Jul 12',so2:61,no2:52,pm25:54,aqi:98,noise:58},
      {date:'Jul 13',so2:144,no2:88,pm25:99,aqi:268,noise:74},
      {date:'Jul 14',so2:139,no2:85,pm25:94,aqi:261,noise:72},
      {date:'Jul 15',so2:142,no2:88,pm25:98,aqi:267,noise:74},
    ],
  },
  {
    id:'IND002', name:'Maharashtra Textiles Ltd', type:'Textile Processing', district:'Pune',
    lat:18.5118, lng:73.9158, contactPerson:'Priya Deshmukh', phone:'+91-20-2345678',
    assignedRO:'Anita Sharma', currentSo2:64, currentNo2:68, currentPm25:58,
    complianceRate:71, lastReport:'2024-07-15',
    history:[
      {date:'Jul 9',so2:58,no2:72,pm25:56,aqi:138,noise:62},
      {date:'Jul 10',so2:61,no2:68,pm25:54,aqi:132,noise:60},
      {date:'Jul 11',so2:55,no2:74,pm25:58,aqi:144,noise:63},
      {date:'Jul 12',so2:52,no2:65,pm25:51,aqi:128,noise:59},
      {date:'Jul 13',so2:67,no2:71,pm25:61,aqi:148,noise:64},
      {date:'Jul 14',so2:63,no2:66,pm25:57,aqi:136,noise:61},
      {date:'Jul 15',so2:64,no2:68,pm25:58,aqi:141,noise:62},
    ],
  },
  {
    id:'IND003', name:'Pune Chemicals Co.', type:'Chemical Processing', district:'Pune',
    lat:18.4818, lng:73.8758, contactPerson:'Vikram Joshi', phone:'+91-20-3456789',
    assignedRO:'Anita Sharma', currentSo2:38, currentNo2:31, currentPm25:27,
    complianceRate:96, lastReport:'2024-07-15',
    history:[
      {date:'Jul 9',so2:41,no2:34,pm25:29,aqi:82,noise:47},
      {date:'Jul 10',so2:38,no2:31,pm25:27,aqi:78,noise:45},
      {date:'Jul 11',so2:36,no2:29,pm25:25,aqi:74,noise:44},
      {date:'Jul 12',so2:40,no2:33,pm25:28,aqi:80,noise:46},
      {date:'Jul 13',so2:37,no2:30,pm25:26,aqi:76,noise:44},
      {date:'Jul 14',so2:39,no2:32,pm25:27,aqi:79,noise:45},
      {date:'Jul 15',so2:38,no2:31,pm25:27,aqi:78,noise:45},
    ],
  },
];

export const REPORTS: Report[] = [
  {id:'RPT001',industry:'Bharat Steel Works',type:'Daily',date:'2024-07-15',parameters:'SO₂, NO₂, PM2.5, Noise',status:'Non-Compliant',submittedBy:'Suresh Patil'},
  {id:'RPT002',industry:'Maharashtra Textiles Ltd',type:'Daily',date:'2024-07-15',parameters:'SO₂, NO₂, PM2.5',status:'Non-Compliant',submittedBy:'Priya Deshmukh'},
  {id:'RPT003',industry:'Pune Chemicals Co.',type:'Daily',date:'2024-07-15',parameters:'SO₂, NO₂, PM2.5, Noise',status:'Compliant',submittedBy:'Vikram Joshi'},
  {id:'RPT004',industry:'Bharat Steel Works',type:'Monthly',date:'2024-06-30',parameters:'All Parameters',status:'Non-Compliant',submittedBy:'Suresh Patil'},
  {id:'RPT005',industry:'Maharashtra Textiles Ltd',type:'Monthly',date:'2024-06-30',parameters:'All Parameters',status:'Compliant',submittedBy:'Priya Deshmukh'},
  {id:'RPT006',industry:'Pune Chemicals Co.',type:'Monthly',date:'2024-06-30',parameters:'All Parameters',status:'Compliant',submittedBy:'Vikram Joshi'},
  {id:'RPT007',industry:'Bharat Steel Works',type:'Daily',date:'2024-07-14',parameters:'SO₂, NO₂, PM2.5',status:'Non-Compliant',submittedBy:'Suresh Patil'},
  {id:'RPT008',industry:'Pune Chemicals Co.',type:'Daily',date:'2024-07-14',parameters:'SO₂, NO₂, PM2.5, Noise',status:'Compliant',submittedBy:'Vikram Joshi'},
  {id:'RPT009',industry:'Maharashtra Textiles Ltd',type:'Daily',date:'2024-07-14',parameters:'SO₂, NO₂',status:'Pending',submittedBy:'Priya Deshmukh'},
  {id:'RPT010',industry:'Bharat Steel Works',type:'Daily',date:'2024-07-13',parameters:'SO₂, NO₂, PM2.5',status:'Non-Compliant',submittedBy:'Suresh Patil'},
];

export const USERS: User[] = [
  {id:1,name:'Arjun Mehta',role:'Super Admin',email:'admin@prithvinet.gov.in',password:'admin123',redirect:'/dashboard'},
  {id:2,name:'Rajesh Kumar',role:'Regional Officer',email:'ro@prithvinet.gov.in',password:'ro123',district:'Nagpur',redirect:'/dashboard'},
  {id:3,name:'Suresh Patil',role:'Industry User',email:'industry@bharatsteel.in',password:'industry123',redirect:'/submit'},
  {id:4,name:'Citizen',role:'Citizen',email:'citizen@gmail.com',password:'citizen123',redirect:'/public'},
];

export const FORECAST_DATA = Array.from({length:72},(_,i)=>{
  const hour=i%24;
  const base=140;
  const rush=(hour>=7&&hour<=10)||(hour>=17&&hour<=20)?40:0;
  const night=hour>=23||hour<=5?-30:0;
  const trend=i>48?-15:i>24?-5:0;
  const v=base+rush+night+trend+Math.round((Math.random()-0.5)*20);
  return {
    hour:`+${i}h`,
    predicted:Math.max(40,v),
    upper:Math.max(50,v+25),
    lower:Math.max(30,v-20),
    actual:i<24?Math.max(40,v+Math.round((Math.random()-0.5)*15)):null,
  };
});

export interface MonthlyReport {
  id: string; month: string; year: number;
  so2Avg: number; no2Avg: number; pm25Avg: number;
  status: 'Compliant' | 'Non-Compliant'; submittedOn: string;
}
export const MONTHLY_REPORTS: MonthlyReport[] = [
  { id:'MR001', month:'January',  year:2024, so2Avg:138, no2Avg:84, pm25Avg:96,  status:'Non-Compliant', submittedOn:'2024-02-01' },
  { id:'MR002', month:'February', year:2024, so2Avg:142, no2Avg:88, pm25Avg:101, status:'Non-Compliant', submittedOn:'2024-03-01' },
  { id:'MR003', month:'March',    year:2024, so2Avg:58,  no2Avg:52, pm25Avg:49,  status:'Compliant',     submittedOn:'2024-04-02' },
  { id:'MR004', month:'April',    year:2024, so2Avg:135, no2Avg:81, pm25Avg:93,  status:'Non-Compliant', submittedOn:'2024-05-01' },
  { id:'MR005', month:'May',      year:2024, so2Avg:144, no2Avg:89, pm25Avg:102, status:'Non-Compliant', submittedOn:'2024-06-03' },
  { id:'MR006', month:'June',     year:2024, so2Avg:71,  no2Avg:61, pm25Avg:58,  status:'Compliant',     submittedOn:'2024-07-01' },
];
