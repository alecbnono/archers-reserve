
export default function Header() {
    return (
        <div className="flex flex-col items-center gap-8 py-10 px-10 md:px-20 ">
            <h1 className="text-2xl font-medium">About ArchersReserve</h1>
            <div className="inline-block border-b-2 border-[#3d5a3d] pb-1">
                <p className="text-lg text-muted-foreground font-medium">
                Your one-stop solution for laboratory management.  
                </p>
            </div>
        </div>
    );
}
