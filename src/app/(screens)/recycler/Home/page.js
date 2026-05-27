"use client"
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import RecyclerHomeRightContainer from '@/components/private components/recycler/Home/rightContainer';
import { Loader2 } from 'lucide-react';

const RecyclerHomeLeftContainer = dynamic(
  () => import('@/components/private components/recycler/Home/leftContainer'),
  { ssr: false, loading: () => <div className="col-span-1 lg:col-span-7 h-[55vw] min-h-[300px] lg:h-full bg-[#0a0a0a] border border-white/5 rounded-[32px] lg:rounded-[48px] animate-pulse" /> }
);

const API_URL = 'http://127.0.0.1:8000/recycler/home';

export default function RecyclerHome() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(API_URL, {
          credentials: 'include',
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load dashboard (' + res.status + ')');
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  return (
    <div className="w-full bg-[#050505] text-white font-sans selection:bg-[#08CB00] lg:h-screen lg:overflow-hidden lg:flex lg:flex-col lg:p-6 lg:gap-6">

      {/* header spacer */}
      <div className="h-16 lg:shrink-0" />

      {loading && (
        <div className="flex-1 flex items-center justify-center gap-3 text-white/30">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest">Loading dashboard...</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-xs font-black text-red-400 uppercase tracking-widest">Failed to load</p>
            <p className="text-[10px] text-white/30">{error}</p>
            <button
              onClick={() => { setError(null); setLoading(true); fetch(API_URL, { credentials: 'include' }).then(r => r.json()).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false)); }}
              className="mt-3 px-4 py-2 bg-[#08CB00]/10 border border-[#08CB00]/20 text-[#08CB00] text-[10px] font-black uppercase rounded-xl hover:bg-[#08CB00]/20 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* MAIN BODY */}
      {!loading && !error && (
        <div className="p-4 pb-8 lg:p-0 lg:flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 lg:min-h-0 lg:overflow-hidden">
          <RecyclerHomeLeftContainer
            profile={data?.profile}
            dropOffSites={data?.drop_off_sites ?? []}
          />
          <RecyclerHomeRightContainer
            incomingOffers={data?.incoming_offers ?? []}
            activeJobs={data?.active_jobs ?? []}
            stats={data?.stats ?? {}}
          />
        </div>
      )}
    </div>
  );
}
