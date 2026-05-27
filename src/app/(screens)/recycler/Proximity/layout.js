import React from 'react';
import RecyclerHeader from '@/components/global components/recyclerHeader/header';


const ProximityLayout = ({children}) => {
    return (
        <>
            <RecyclerHeader />
            {children}
        </>
    );
}



export default ProximityLayout;
