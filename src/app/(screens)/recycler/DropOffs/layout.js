import React from 'react';
import RecyclerHeader from '@/components/global components/recyclerHeader/header';

const DropOffsLayout = ({children}) => {
    return (
        <>
            <RecyclerHeader />
            {children}
        </>
    );
}



export default DropOffsLayout;
