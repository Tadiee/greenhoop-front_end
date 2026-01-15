import { Leaf, Globe, Zap} from 'lucide-react';
import FluxStyleMetricCard from '@/components/global components/FluxComp/flux';

export default function MiddleContainer () {
    return (
        <>
        {/* --- SECTION 2: FLUX METRIC CARDS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FluxStyleMetricCard 
            title="E-Waste Weight" icon={Leaf} mainStat="42,8kg" subStat="Total Mass Recycled" trend="+12%"
            categories={[
              { label: 'High Performance', value: '25kg', percentage: 58, color: '#08CB00' },
              { label: 'Mobile Tech', value: '12kg', percentage: 28, color: '#ffffff' },
              { label: 'Components', value: '5.8kg', percentage: 14, color: '#A3E635' }
            ]}
          />
          <FluxStyleMetricCard 
            title="Global Rank" icon={Globe} mainStat="#1,244" subStat="Worldwide Leaderboard" trend="+5%"
            categories={[
              { label: 'Harare', value: '#12', percentage: 85, color: '#08CB00' },
              { label: 'Regional', value: '#402', percentage: 45, color: '#ffffff' },
              { label: 'Global', value: '#1244', percentage: 15, color: '#A3E635' }
            ]}
          />
          <FluxStyleMetricCard 
            title="CO2 Offset" icon={Zap} mainStat="114kg" subStat="Verified Carbon Mitigation" trend="+18%"
            categories={[
              { label: 'Recovery', value: '80kg', percentage: 70, color: '#08CB00' },
              { label: 'Refurbished', value: '24kg', percentage: 21, color: '#ffffff' },
              { label: 'Avoided', value: '10kg', percentage: 9, color: '#A3E635' }
            ]}
          />
        </section>
        </>
    )
}