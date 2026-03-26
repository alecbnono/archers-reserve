import type { Route } from "./+types/landing";

import HeroSection from "~/features/landing/components/organisms/HeroSection";
import Faq from "~/features/landing/components/organisms/Faq";
import AboutSection from "~/features/landing/components/organisms/AboutSection";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function Landing() {
    return (
        <div className="flex flex-col items-center">
            <HeroSection />
            <AboutSection />
            <Faq />
        </div>
    );
}
