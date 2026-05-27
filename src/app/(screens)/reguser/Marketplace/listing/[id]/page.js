"use client"
import ListingDetail from '@/components/private components/reguser components/Marketplace/ListingDetail';
import { useParams } from 'next/navigation';

export default function ListingPage() {
    const { id } = useParams();

    return (
        <div className="h-screen bg-[#050505] text-white font-sans selection:bg-[#08CB00] overflow-y-auto scrollbar-thin">
            <ListingDetail listingId={id} />
        </div>
    );
}
