import { LuScreenShare } from "react-icons/lu";
import { NavLink } from "react-router";

export default function Navbar() {
    return (
        <nav className="flex py-5 px-10 justify-between">
            <div className="flex items-center gap-2">
                <LuScreenShare size={24} />
                <p className="font-medium">ArchersReserve</p>
            </div>
            <div className="flex gap-4">
                <p>Login</p>
                <p>Register</p>
            </div>
        </nav>
    );
}
