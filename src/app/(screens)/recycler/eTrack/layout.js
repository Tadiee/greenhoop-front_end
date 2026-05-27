import React from 'react';
import RecyclerHeader from '@/components/global components/recyclerHeader/header';

const EtrackLayout = ({children}) => {
    return (
        <>
            <RecyclerHeader />
            {children}
        </>
    );
}



export default EtrackLayout;