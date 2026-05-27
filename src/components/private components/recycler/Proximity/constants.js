// Constants for Proximity page
import { 
  Smartphone,
  Laptop,
  Monitor,
  Battery,
  Cpu,
  Package
} from 'lucide-react';

export const CATEGORY_ICONS = {
  "Mobile Phone": Smartphone,
  "Laptop": Laptop,
  "Desktop PC": Monitor,
  "Television": Monitor,
  "Battery": Battery,
  "Small Electronics": Cpu,
  "Other": Package,
};

export const CATEGORIES = ['All', 'Mobile Phone', 'Laptop', 'Desktop PC', 'Television', 'Battery', 'Small Electronics'];
export const DEVICE_STATES = ['All', 'Working', 'Damaged', 'Scrap'];

export const getTimeRemaining = (expiresAt) => {
  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return 'Expired';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m left`;
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ${hrs % 24}h left`;
  return `${hrs}h ${mins % 60}m left`;
};

// Dummy submissions data within Harare area - full data matching rightContainer
export const DUMMY_SUBMISSIONS = [
  { 
    submit_id: 101, 
    category: 'Laptop', 
    brand_n_model: 'Dell Latitude 5520', 
    device_state: 'Scrap', 
    estimated_weight: 2.1, 
    submission_type: 'RECYCLER_PICKUP',
    preferred_date: '2026-04-15',
    preferred_time: '14:30',
    your_score: 87,
    expires_at: '2026-04-20T10:30:00Z',
    estimated_cost: 45.00,
    latitude: -17.8252, 
    longitude: 31.0335,
    distance: 0.5,
    status: 'OFFERED',
    isNew: true,
    mineral_composition: { gold_usd: 25.50, silver_usd: 3.20, aluminum_usd: 1.80, lithium_usd: 0.50, platinum_usd: 0.00, rhodium_usd: 0.00, nickel_usd: 2.00, tin_usd: 0.50, carbon_usd: 1.20 }
  },
  { 
    submit_id: 102, 
    category: 'Mobile Phone', 
    brand_n_model: 'Samsung Galaxy S21', 
    device_state: 'Damaged', 
    estimated_weight: 0.18, 
    submission_type: 'RECYCLER_PICKUP',
    preferred_date: '2026-04-14',
    preferred_time: '09:00',
    your_score: 62,
    expires_at: '2026-04-18T09:15:00Z',
    estimated_cost: 12.50,
    latitude: -17.8452, 
    longitude: 31.0535,
    distance: 2.3,
    status: 'OFFERED',
    isNew: false,
    mineral_composition: { gold_usd: 8.50, silver_usd: 1.20, aluminum_usd: 0.80, lithium_usd: 0.00, platinum_usd: 0.50, rhodium_usd: 0.20, nickel_usd: 0.80, tin_usd: 0.10, carbon_usd: 0.40 }
  },
  { 
    submit_id: 103, 
    category: 'Battery', 
    brand_n_model: 'Li-Ion Pack 48V', 
    device_state: 'Scrap', 
    estimated_weight: 12.5, 
    submission_type: 'RECYCLER_PICKUP',
    preferred_date: '2026-04-16',
    preferred_time: null,
    your_score: 95,
    expires_at: '2026-04-19T14:00:00Z',
    estimated_cost: 85.00,
    latitude: -17.8152, 
    longitude: 31.0235,
    distance: 1.2,
    status: 'OFFERED',
    isNew: true,
    mineral_composition: { gold_usd: 15.00, silver_usd: 8.50, aluminum_usd: 12.00, lithium_usd: 45.00, platinum_usd: 0.00, rhodium_usd: 0.00, nickel_usd: 4.50, tin_usd: 0.00, carbon_usd: 0.00 }
  },
  { 
    submit_id: 104, 
    category: 'Television', 
    brand_n_model: 'Samsung 55" 4K', 
    device_state: 'Working', 
    estimated_weight: 15.0, 
    submission_type: 'RECYCLER_PICKUP',
    preferred_date: '2026-04-17',
    preferred_time: '16:00',
    your_score: 78,
    expires_at: '2026-04-21T12:00:00Z',
    estimated_cost: 32.00,
    latitude: -17.8352, 
    longitude: 31.0135,
    distance: 3.1,
    status: 'OFFERED',
    isNew: false,
    mineral_composition: { gold_usd: 5.00, silver_usd: 2.00, aluminum_usd: 18.00, lithium_usd: 0.00, platinum_usd: 0.00, rhodium_usd: 0.00, nickel_usd: 1.50, tin_usd: 0.80, carbon_usd: 2.00 }
  },
  { 
    submit_id: 105, 
    category: 'Small Electronics', 
    brand_n_model: 'Various Chargers', 
    device_state: 'Scrap', 
    estimated_weight: 1.5, 
    submission_type: 'RECYCLER_PICKUP',
    preferred_date: '2026-04-18',
    preferred_time: '10:00',
    your_score: 45,
    expires_at: '2026-04-22T08:00:00Z',
    estimated_cost: 8.00,
    latitude: -17.8052, 
    longitude: 31.0435,
    distance: 1.8,
    status: 'OFFERED',
    isNew: false,
    mineral_composition: { gold_usd: 1.50, silver_usd: 0.80, aluminum_usd: 2.00, lithium_usd: 0.20, platinum_usd: 0.00, rhodium_usd: 0.00, nickel_usd: 0.50, tin_usd: 0.30, carbon_usd: 0.80 }
  },
  { 
    submit_id: 106, 
    category: 'Desktop PC', 
    brand_n_model: 'HP Pavilion Gaming', 
    device_state: 'Damaged', 
    estimated_weight: 8.5, 
    submission_type: 'RECYCLER_PICKUP',
    preferred_date: '2026-04-19',
    preferred_time: '13:30',
    your_score: 88,
    expires_at: '2026-04-23T15:00:00Z',
    estimated_cost: 55.00,
    latitude: -17.7922, 
    longitude: 31.0555,
    distance: 4.2,
    status: 'OFFERED',
    isNew: true,
    mineral_composition: { gold_usd: 35.00, silver_usd: 8.00, aluminum_usd: 6.00, lithium_usd: 1.50, platinum_usd: 0.50, rhodium_usd: 0.30, nickel_usd: 3.00, tin_usd: 1.20, carbon_usd: 1.50 }
  },
];

// Dummy Drop-off Sites in Harare area
export const DROP_OFF_SITES = [
  {
    site_id: 1,
    name: 'GreenHoop Main Hub',
    address: '123 Industrial Road, Msasa, Harare',
    latitude: -17.8252,
    longitude: 31.0335,
    capacity: { current: 450, max: 1000, unit: 'kg' },
    status: 'ACTIVE',
    hours: 'Mon-Fri 08:00-17:00',
    contact: '+263 242 123 456',
    features: ['Wheelchair Access', 'Parking', 'Instant Weighing'],
    rating: 4.8,
    distance: 0.5
  },
  {
    site_id: 2,
    name: 'Westgate Collection Point',
    address: 'Westgate Shopping Centre, Harare',
    latitude: -17.7852,
    longitude: 30.9935,
    capacity: { current: 280, max: 500, unit: 'kg' },
    status: 'ACTIVE',
    hours: 'Mon-Sat 09:00-18:00',
    contact: '+263 242 789 012',
    features: ['Secure Storage', 'EV Charging'],
    rating: 4.5,
    distance: 5.2
  },
  {
    site_id: 3,
    name: 'Eastlea Community Center',
    address: '45 Chinamano Road, Eastlea, Harare',
    latitude: -17.8152,
    longitude: 31.0635,
    capacity: { current: 120, max: 300, unit: 'kg' },
    status: 'NEAR_CAPACITY',
    hours: 'Mon-Fri 09:00-16:00',
    contact: '+263 242 345 678',
    features: ['Community Friendly', 'Education Center'],
    rating: 4.6,
    distance: 3.1
  },
  {
    site_id: 4,
    name: 'Avondale Tech Hub',
    address: 'King George Road, Avondale, Harare',
    latitude: -17.8052,
    longitude: 31.0435,
    capacity: { current: 350, max: 600, unit: 'kg' },
    status: 'ACTIVE',
    hours: 'Mon-Sun 08:00-20:00',
    contact: '+263 242 901 234',
    features: ['Extended Hours', 'Tech Repair Available'],
    rating: 4.7,
    distance: 2.8
  },
  {
    site_id: 5,
    name: 'Chitungwiza Satellite Point',
    address: 'Unit A, Zengeza 4, Chitungwiza',
    latitude: -17.8952,
    longitude: 31.0735,
    capacity: { current: 180, max: 400, unit: 'kg' },
    status: 'MAINTENANCE',
    hours: 'Tue-Sat 09:00-15:00',
    contact: '+263 242 567 890',
    features: ['Rural Reach'],
    rating: 4.3,
    distance: 8.5
  }
];

// Dummy Courier Services in Harare area
export const COURIERS = [
  {
    courier_id: 101,
    company_name: 'SwiftEco Logistics',
    contact_person: 'Tinashe M.',
    phone: '+263 77 123 4567',
    rating: 4.9,
    base_rate: 5.00,
    per_kg_rate: 0.50,
    coverage_radius: 25,
    specialties: ['Fragile Electronics', 'Battery Transport'],
    available: true,
    eta_minutes: 35,
    vehicle_type: 'Refrigerated Van',
    insurance_included: true
  },
  {
    courier_id: 102,
    company_name: 'GreenTransit Zimbabwe',
    contact_person: 'Grace K.',
    phone: '+263 77 234 5678',
    rating: 4.7,
    base_rate: 4.50,
    per_kg_rate: 0.45,
    coverage_radius: 50,
    specialties: ['Bulk Collection', 'Corporate Pickup'],
    available: true,
    eta_minutes: 50,
    vehicle_type: 'Flatbed Truck',
    insurance_included: true
  },
  {
    courier_id: 103,
    company_name: 'EcoMoto Couriers',
    contact_person: 'Simba R.',
    phone: '+263 77 345 6789',
    rating: 4.5,
    base_rate: 3.00,
    per_kg_rate: 0.35,
    coverage_radius: 15,
    specialties: ['Small Items', 'Same Day'],
    available: true,
    eta_minutes: 20,
    vehicle_type: 'Electric Motorcycle',
    insurance_included: false
  },
  {
    courier_id: 104,
    company_name: 'Harare Haulers',
    contact_person: 'John D.',
    phone: '+263 77 456 7890',
    rating: 4.3,
    base_rate: 6.00,
    per_kg_rate: 0.60,
    coverage_radius: 100,
    specialties: ['Heavy Equipment', 'Long Distance'],
    available: false,
    eta_minutes: 75,
    vehicle_type: 'Box Truck',
    insurance_included: true
  }
];

// Calculate courier cost based on weight
export const calculateCourierCost = (courier, weight) => {
  return courier.base_rate + (courier.per_kg_rate * weight);
};
