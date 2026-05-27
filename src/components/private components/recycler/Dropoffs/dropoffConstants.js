export const SITE_STATUSES = ['Active', 'Inactive', 'Maintenance', 'Full'];

export const ACCEPTED_CATEGORIES = [
  'Laptops', 'Mobile Phones', 'Batteries', 'Desktop PCs',
  'Televisions', 'Printers', 'Hard Drives', 'Mixed E-Waste',
];

export const DUMMY_RECEIVERS = [
  { id: 'RX-901', name: 'Tendai Moyo',    phone: '+263 77 123 4567', role: 'Site Manager',  site_id: 1, active: true },
  { id: 'RX-902', name: 'Grace Chikwanda', phone: '+263 77 234 5678', role: 'Collector',     site_id: 1, active: true },
  { id: 'RX-903', name: 'Brian Ncube',     phone: '+263 77 345 6789', role: 'Site Manager',  site_id: 2, active: true },
  { id: 'RX-904', name: 'Sharon Dube',     phone: '+263 77 456 7890', role: 'Collector',     site_id: 3, active: false },
  { id: 'RX-905', name: 'Farai Mutasa',    phone: '+263 77 567 8901', role: 'Site Manager',  site_id: 4, active: true },
];

export const DUMMY_SITES = [
  {
    id: 1,
    name: 'Mbare Central Hub',
    address: '14 Remembrance Drive, Mbare, Harare',
    latitude: -17.8670,
    longitude: 31.0380,
    status: 'Active',
    capacity_kg: 2500,
    current_load_kg: 1850,
    operating_hours: '07:00 - 18:00',
    accepted_categories: ['Laptops', 'Mobile Phones', 'Batteries'],
    geofence_radius: 500,
    created_at: '2025-11-01',
    notes: 'Highest volume site. Near Mbare Musika.',
  },
  {
    id: 2,
    name: 'Mt Pleasant Hub',
    address: '42 Enterprise Rd, Mt Pleasant, Harare',
    latitude: -17.7700,
    longitude: 31.0490,
    status: 'Active',
    capacity_kg: 1500,
    current_load_kg: 780,
    operating_hours: '08:00 - 17:00',
    accepted_categories: ['Desktop PCs', 'Mixed E-Waste', 'Printers'],
    geofence_radius: 300,
    created_at: '2025-12-10',
    notes: '',
  },
  {
    id: 3,
    name: 'Avondale Depot',
    address: '5 King George Rd, Avondale, Harare',
    latitude: -17.8050,
    longitude: 31.0210,
    status: 'Maintenance',
    capacity_kg: 1000,
    current_load_kg: 100,
    operating_hours: '09:00 - 15:00',
    accepted_categories: ['Batteries', 'Mobile Phones'],
    geofence_radius: 200,
    created_at: '2026-01-15',
    notes: 'Under maintenance — limited capacity.',
  },
  {
    id: 4,
    name: 'Borrowdale Yard',
    address: '88 Borrowdale Rd, Borrowdale, Harare',
    latitude: -17.7370,
    longitude: 31.0870,
    status: 'Full',
    capacity_kg: 2000,
    current_load_kg: 2000,
    operating_hours: '08:00 - 18:00',
    accepted_categories: ['Laptops', 'Desktop PCs', 'Televisions', 'Hard Drives'],
    geofence_radius: 400,
    created_at: '2026-02-01',
    notes: 'At full capacity — dispatch required.',
  },
];

export const STATUS_COLORS = {
  Active:      { bg: 'bg-[#08CB00]/10', text: 'text-[#08CB00]',   border: 'border-[#08CB00]/30',   dot: 'bg-[#08CB00]' },
  Inactive:    { bg: 'bg-white/5',      text: 'text-white/30',     border: 'border-white/10',        dot: 'bg-white/20' },
  Maintenance: { bg: 'bg-yellow-500/10',text: 'text-yellow-400',   border: 'border-yellow-500/30',   dot: 'bg-yellow-400' },
  Full:        { bg: 'bg-red-500/10',   text: 'text-red-400',      border: 'border-red-500/30',      dot: 'bg-red-400' },
};
