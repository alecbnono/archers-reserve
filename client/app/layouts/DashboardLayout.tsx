import { Outlet } from "react-router";
import DashboardNav from "~/components/organisms/DashboardNav";
import Footer from "~/components/organisms/Footer";

export default function DashboardLayout() {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col md:flex-row">
                <DashboardNav />
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
