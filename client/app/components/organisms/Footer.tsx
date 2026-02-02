import { FaRegCopyright } from "react-icons/fa6";

export default function Footer() {
    return (
        <div className="flex py-5 px-10 justify-center text-neutral-400">
            <div className="flex items-center gap-1">
                <FaRegCopyright />
                <p>2026 ArchersReserve</p>
            </div>
        </div>
    );
}
