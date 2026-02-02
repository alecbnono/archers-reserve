import { FaBook } from "react-icons/fa";
import { LuScreenShare } from "react-icons/lu";
import { FaUserLarge } from "react-icons/fa6";
import { Button } from "../ui/button";

export default function DashboardNav() {
    return (
        <>
            <div className="flex flex-col gap-8 p-8 border-r-1 h-screen">
                <div className="flex items-center gap-2">
                    <LuScreenShare size={24} />
                    <p className="font-medium">ArchersReserve</p>
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="justify-start py-5" variant="outline">
                        <FaUserLarge />
                        <p>Account</p>
                    </Button>
                    <Button className="justify-start py-5" variant="outline">
                        <FaBook />
                        <p>Reserve</p>
                    </Button>
                </div>
            </div>
        </>
    );
}
