import type { Route } from "./+types/about";

import Header from "~/features/about/components/organisms/Header";
import AboutContent from "~/features/about/components/organisms/AboutContent";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "About | ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function About() {
    return (
        <div className="flex flex-col items-center">
            <Header />
            <AboutContent />
        </div>
    );
}
