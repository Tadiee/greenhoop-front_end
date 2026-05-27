import { Monitor, Smartphone, Battery, Cpu, Tv, Printer, HardDrive, Package } from 'lucide-react';

export const CATEGORY_ICONS = {
  'Laptop': Monitor,
  'Mobile Phone': Smartphone,
  'Battery': Battery,
  'Desktop PC': Cpu,
  'Television': Tv,
  'Printer': Printer,
  'Hard Drive': HardDrive,
};

// Full lifecycle statuses in order
export const LIFECYCLE_STATUSES = [
  { key: 'ACCEPTED',          label: 'Accepted',            description: 'Offer accepted by recycler' },
  { key: 'AWAITING_DELIVERY', label: 'Awaiting Delivery',   description: 'Waiting for item to arrive' },
  { key: 'RECEIVED',          label: 'Received',            description: 'Item physically received' },
  { key: 'ASSESSMENT',        label: 'Assessment',          description: 'Device being evaluated' },
  { key: 'PROCESSING',        label: 'Processing',          description: 'Disassembly / sorting underway' },
  { key: 'EXTRACTION',        label: 'Extraction',          description: 'Material extraction in progress' },
  { key: 'COMPLETED',         label: 'Completed',           description: 'End-of-life process complete' },
];

// End-of-life outcomes the recycler can set
export const END_OF_LIFE_OUTCOMES = [
  { id: 'RECYCLED',    label: 'Fully Recycled',     color: '#08CB00', description: 'Materials recovered and reprocessed' },
  { id: 'REFURBISHED', label: 'Refurbished',         color: '#3B82F6', description: 'Device repaired and resold' },
  { id: 'PARTS',       label: 'Parts Harvested',     color: '#A855F7', description: 'Usable parts extracted for resale' },
  { id: 'LANDFILL',    label: 'Landfill (Non-Rec.)', color: '#EF4444', description: 'Item could not be recycled' },
  { id: 'HAZARDOUS',   label: 'Hazardous Disposal',  color: '#F59E0B', description: 'Sent to certified hazardous disposal' },
];

// Dummy accepted submissions data for the eTrack page
export const ACCEPTED_SUBMISSIONS = [
  {
    submit_id: 101,
    category: 'Laptop',
    brand_n_model: 'Dell Latitude 5520',
    device_state: 'Scrap',
    estimated_weight: 2.1,
    estimated_cost: 45.00,
    current_status: 'ASSESSMENT',
    end_of_life_outcome: null,
    delivery_method: 'DROPOFF',
    drop_off_site: 'GreenHoop Main Hub',
    submitted_by: { name: 'John Mutasa', phone: '+263 77 123 4567' },
    accepted_at: '2026-04-13T10:30:00Z',
    received_at: '2026-04-14T09:00:00Z',
    mineral_composition: { gold_usd: 18, silver_usd: 5, aluminum_usd: 8, lithium_usd: 3, copper_usd: 6 },
    notes: '',
    timeline: [
      { status: 'ACCEPTED', at: '2026-04-13T10:30:00Z' },
      { status: 'AWAITING_DELIVERY', at: '2026-04-13T10:31:00Z' },
      { status: 'RECEIVED', at: '2026-04-14T09:00:00Z' },
      { status: 'ASSESSMENT', at: '2026-04-14T11:00:00Z' },
    ],
  },
  {
    submit_id: 103,
    category: 'Battery',
    brand_n_model: 'Li-Ion Pack 48V',
    device_state: 'Scrap',
    estimated_weight: 12.5,
    estimated_cost: 85.00,
    current_status: 'PROCESSING',
    end_of_life_outcome: null,
    delivery_method: 'COURIER',
    courier: 'SwiftEco Logistics',
    submitted_by: { name: 'Sarah Ndlovu', phone: '+263 77 987 6543' },
    accepted_at: '2026-04-12T09:15:00Z',
    received_at: '2026-04-12T14:00:00Z',
    mineral_composition: { lithium_usd: 42, nickel_usd: 18, cobalt_usd: 12, copper_usd: 8 },
    notes: 'Cells appear swollen — handle with care.',
    timeline: [
      { status: 'ACCEPTED', at: '2026-04-12T09:15:00Z' },
      { status: 'AWAITING_DELIVERY', at: '2026-04-12T09:16:00Z' },
      { status: 'RECEIVED', at: '2026-04-12T14:00:00Z' },
      { status: 'ASSESSMENT', at: '2026-04-12T15:00:00Z' },
      { status: 'PROCESSING', at: '2026-04-13T08:00:00Z' },
    ],
  },
  {
    submit_id: 106,
    category: 'Desktop PC',
    brand_n_model: 'HP Pavilion Gaming',
    device_state: 'Damaged',
    estimated_weight: 8.5,
    estimated_cost: 55.00,
    current_status: 'COMPLETED',
    end_of_life_outcome: 'RECYCLED',
    delivery_method: 'DROPOFF',
    drop_off_site: 'Avondale Tech Hub',
    submitted_by: { name: 'Michael Chiwara', phone: '+263 77 456 7890' },
    accepted_at: '2026-04-10T14:00:00Z',
    received_at: '2026-04-11T08:30:00Z',
    mineral_composition: { gold_usd: 22, silver_usd: 9, aluminum_usd: 14, copper_usd: 10, tin_usd: 3 },
    notes: 'GPU salvaged and resold.',
    timeline: [
      { status: 'ACCEPTED', at: '2026-04-10T14:00:00Z' },
      { status: 'AWAITING_DELIVERY', at: '2026-04-10T14:01:00Z' },
      { status: 'RECEIVED', at: '2026-04-11T08:30:00Z' },
      { status: 'ASSESSMENT', at: '2026-04-11T10:00:00Z' },
      { status: 'PROCESSING', at: '2026-04-11T14:00:00Z' },
      { status: 'EXTRACTION', at: '2026-04-12T08:00:00Z' },
      { status: 'COMPLETED', at: '2026-04-13T12:00:00Z' },
    ],
  },
  {
    submit_id: 108,
    category: 'Mobile Phone',
    brand_n_model: 'iPhone 11 (lot x6)',
    device_state: 'Damaged',
    estimated_weight: 1.1,
    estimated_cost: 38.00,
    current_status: 'RECEIVED',
    end_of_life_outcome: null,
    delivery_method: 'COURIER',
    courier: 'EcoMoto Couriers',
    submitted_by: { name: 'Rudo Sithole', phone: '+263 77 654 3210' },
    accepted_at: '2026-04-14T07:00:00Z',
    received_at: '2026-04-14T11:00:00Z',
    mineral_composition: { gold_usd: 12, silver_usd: 4, aluminum_usd: 3, lithium_usd: 8, platinum_usd: 2 },
    notes: '',
    timeline: [
      { status: 'ACCEPTED', at: '2026-04-14T07:00:00Z' },
      { status: 'AWAITING_DELIVERY', at: '2026-04-14T07:01:00Z' },
      { status: 'RECEIVED', at: '2026-04-14T11:00:00Z' },
    ],
  },
];

export const getStatusIndex = (statusKey) =>
  LIFECYCLE_STATUSES.findIndex(s => s.key === statusKey);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
