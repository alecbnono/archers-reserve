import type { Route } from "./+types/landing";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../components/ui/sheet";

import HeroSection from "~/features/landing/components/HeroSection";
import AboutSection from "~/features/landing/components/AboutSection";
import Faq from "~/features/landing/components/Faq";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function Landing() {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <Faq />
        </>
    );
}
