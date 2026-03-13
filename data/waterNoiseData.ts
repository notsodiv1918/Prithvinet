export const WATER_STATIONS = [
  { id:'WTR001', name:'Mithi River Monitoring Point', body:'Mithi River', district:'Mumbai', quality:'Critical', ph:6.1, do:2.8, bod:18.4, tds:820, coliform:2400, turbidity:12.5, trend:'worsening', lastUpdated:'Today 9:00 AM' },
  { id:'WTR002', name:'Nag River — Nagpur Central', body:'Nag River', district:'Nagpur', quality:'Critical', ph:5.9, do:1.9, bod:24.1, tds:960, coliform:3100, turbidity:18.2, trend:'worsening', lastUpdated:'Today 8:45 AM' },
  { id:'WTR003', name:'Mula-Mutha — Pune', body:'Mula-Mutha River', district:'Pune', quality:'Poor', ph:6.8, do:4.2, bod:8.6, tds:540, coliform:580, turbidity:4.8, trend:'worsening', lastUpdated:'Today 9:15 AM' },
  { id:'WTR004', name:'Bhima River — Solapur', body:'Bhima River', district:'Solapur', quality:'Poor', ph:7.1, do:5.0, bod:5.2, tds:490, coliform:320, turbidity:3.1, trend:'stable', lastUpdated:'Today 9:30 AM' },
  { id:'WTR005', name:'Godavari — Nashik', body:'Godavari River', district:'Nashik', quality:'Moderate', ph:7.4, do:6.8, bod:2.1, tds:310, coliform:95, turbidity:1.4, trend:'stable', lastUpdated:'Today 9:00 AM' },
  { id:'WTR006', name:'Pawna Lake — Pune', body:'Pawna Lake', district:'Pune', quality:'Good', ph:7.6, do:8.2, bod:0.8, tds:185, coliform:12, turbidity:0.5, trend:'improving', lastUpdated:'Today 8:30 AM' },
  { id:'WTR007', name:'Ulhas River — Thane', body:'Ulhas River', district:'Thane', quality:'Poor', ph:6.5, do:3.8, bod:9.4, tds:620, coliform:710, turbidity:5.6, trend:'worsening', lastUpdated:'Today 9:10 AM' },
  { id:'WTR008', name:'Wardha River — Amravati', body:'Wardha River', district:'Amravati', quality:'Good', ph:7.3, do:7.4, bod:1.2, tds:220, coliform:28, turbidity:0.8, trend:'stable', lastUpdated:'Today 8:50 AM' },
  { id:'WTR009', name:'Venna Lake — Satara', body:'Venna Lake', district:'Satara', quality:'Good', ph:7.5, do:7.9, bod:0.6, tds:160, coliform:8, turbidity:0.4, trend:'improving', lastUpdated:'Today 9:00 AM' },
  { id:'WTR010', name:'Vashishthi River — Ratnagiri', body:'Vashishthi River', district:'Ratnagiri', quality:'Moderate', ph:7.2, do:6.1, bod:2.8, tds:275, coliform:142, turbidity:1.9, trend:'stable', lastUpdated:'Today 9:20 AM' },
];

export const WATER_LIMITS = {
  ph: { min: 6.5, max: 8.5 },
  do: { min: 6 },
  bod: { max: 3 },
  tds: { max: 500 },
  coliform: { max: 50 },
  turbidity: { max: 1 },
};

export const WATER_TREND = [
  { month:'Aug', do:6.8, bod:2.1 },
  { month:'Sep', do:6.2, bod:3.4 },
  { month:'Oct', do:5.8, bod:4.8 },
  { month:'Nov', do:5.1, bod:6.2 },
  { month:'Dec', do:4.6, bod:7.9 },
  { month:'Jan', do:4.2, bod:8.6 },
  { month:'Feb', do:3.9, bod:9.1 },
];

export const NOISE_STATIONS = [
  { id:'NSE001', name:'Dharavi Industrial Area', district:'Mumbai', zone:'Industrial', dayLevel:81, dayLimit:75, nightLevel:74, nightLimit:70, status:'breach', primarySource:'Manufacturing units' },
  { id:'NSE002', name:'Dadar Market Area', district:'Mumbai', zone:'Commercial', dayLevel:72, dayLimit:65, nightLevel:58, nightLimit:55, status:'breach', primarySource:'Market traffic' },
  { id:'NSE003', name:'Butibori MIDC — Nagpur', district:'Nagpur', zone:'Industrial', dayLevel:78, dayLimit:75, nightLevel:68, nightLimit:70, status:'warning', primarySource:'Steel & heavy industry' },
  { id:'NSE004', name:'Civil Lines — Nagpur', district:'Nagpur', zone:'Residential', dayLevel:52, dayLimit:55, nightLevel:41, nightLimit:45, status:'safe', primarySource:'Traffic' },
  { id:'NSE005', name:'Hinjewadi IT Park — Pune', district:'Pune', zone:'Commercial', dayLevel:63, dayLimit:65, nightLevel:50, nightLimit:55, status:'safe', primarySource:'Office traffic' },
  { id:'NSE006', name:'Baner Residential — Pune', district:'Pune', zone:'Residential', dayLevel:61, dayLimit:55, nightLevel:49, nightLimit:45, status:'breach', primarySource:'Construction noise' },
  { id:'NSE007', name:'Thane Station Area', district:'Thane', zone:'Commercial', dayLevel:67, dayLimit:65, nightLevel:53, nightLimit:55, status:'warning', primarySource:'Railway & traffic' },
  { id:'NSE008', name:'Koparkhairane — Navi Mumbai', district:'Navi Mumbai', zone:'Residential', dayLevel:54, dayLimit:55, nightLevel:42, nightLimit:45, status:'safe', primarySource:'Residential' },
  { id:'NSE009', name:'Aurangabad MIDC', district:'Aurangabad', zone:'Industrial', dayLevel:76, dayLimit:75, nightLevel:69, nightLimit:70, status:'warning', primarySource:'Auto parts factories' },
  { id:'NSE010', name:'Nashik Silence Zone — Hospital', district:'Nashik', zone:'Silence', dayLevel:52, dayLimit:50, nightLevel:43, nightLimit:40, status:'breach', primarySource:'Traffic near hospital' },
];

export const NOISE_LIMITS = {
  Industrial:  { day:75, night:70 },
  Commercial:  { day:65, night:55 },
  Residential: { day:55, night:45 },
  Silence:     { day:50, night:40 },
};

export const NOISE_TREND = [
  { time:'12am', level:48 }, { time:'2am', level:44 }, { time:'4am', level:42 },
  { time:'6am', level:55 }, { time:'8am', level:68 }, { time:'10am', level:72 },
  { time:'12pm', level:70 }, { time:'2pm', level:71 }, { time:'4pm', level:73 },
  { time:'6pm', level:75 }, { time:'8pm', level:68 }, { time:'10pm', level:58 },
];
