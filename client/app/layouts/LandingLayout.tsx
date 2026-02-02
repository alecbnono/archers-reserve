import { Outlet } from "react-router";
import Navbar from "~/components/organisms/Navbar";
import Footer from "~/components/organisms/Footer";

export default function LandingLayout() {
    return (
        <div className="flex flex-col">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}
