import { Outlet } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export default function LandingLayout() {
    return (
        <div className="flex flex-col">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}
