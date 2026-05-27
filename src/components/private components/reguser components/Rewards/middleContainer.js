"use client"
import { useState, useEffect, useCallback } from 'react';
import { Leaf, Globe, Zap, RefreshCw } from 'lucide-react';
import FluxStyleMetricCard from '@/components/global components/FluxComp/flux';

const USER_ID = 'd07a118c-ad49-4433-9fdd-e0fcb425c8c0';
const API     = 'http://127.0.0.1:8000';
const CAT_COLORS = ['#08CB00', '#ffffff', '#A3E635'];

function toCats(apiCats, valueKey = 'value_kg', unit = 'kg') {
  const padded = [
    ...apiCats.slice(0, 3),
    ...Array(Math.max(0, 3 - apiCats.length)).fill({ label: '—', [valueKey]: 0, percentage: 0 }),
  ].slice(0, 3);
  return padded.map((c, i) => ({
    label:      c.label,
    value:      `${c[valueKey]}${unit}`,
    percentage: c.percentage ?? 0,
    color:      CAT_COLORS[i],
  }));
}

export default function MiddleContainer() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/rewards/wallet/${USER_ID}/impact-breakdown`, { credentials: 'include' });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[0,1,2].map(i => (
        <div key={i} className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 h-64 flex items-center justify-center">
          <RefreshCw size={18} className="animate-spin text-[#08CB00]" />
        </div>
      ))}
    </section>
  );

  if (error || !data) return null;

  const { weight, co2, rankings } = data;

  const rankCats = [
    { label: 'City',     value: `#${rankings.city_rank   ?? '—'}`, percentage: rankings.city_rank   ? Math.min(Math.max(5, 100 - rankings.city_rank),   100) : 5,  color: '#08CB00' },
    { label: 'Global',   value: `#${rankings.global_rank ?? '—'}`, percentage: rankings.global_rank ? Math.min(Math.max(2, 100 - Math.round(rankings.global_rank / 10)), 100) : 2, color: '#ffffff' },
    { label: 'Devices',  value: `${rankings.submission_count}`,    percentage: Math.min(rankings.submission_count * 5, 100), color: '#A3E635' },
  ];

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FluxStyleMetricCard
          title="E-Waste Weight" icon={Leaf}
          mainStat={`${weight.total_kg}kg`} subStat="Total Mass Recycled" trend=""
          categories={toCats(weight.categories)}
        />
        <FluxStyleMetricCard
          title="Global Rank" icon={Globe}
          mainStat={`#${rankings.global_rank ?? '—'}`} subStat="Worldwide Leaderboard" trend=""
          categories={rankCats}
        />
        <FluxStyleMetricCard
          title="CO₂ Offset" icon={Zap}
          mainStat={`${co2.total_kg}kg`} subStat="Verified Carbon Mitigation" trend=""
          categories={toCats(co2.categories)}
        />
      </section>
    </>
  );
}