import RecyclerHeader from "@/components/global components/recyclerHeader/header";

export default function ReportsLayout ({children} ) {
    return (
        <>
        <RecyclerHeader />
        {children}
        </>
    );
}