import type { InfoCard } from "../types/landing.types";

export default function AboutCard({ heading, body }: InfoCard) {
    return (
        <div className="flex flex-col gap-5 text-center w-75 items-center p-5 rounded-xl bg-neutral-200 shadow-lg">
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-medium">{heading}</h3>
                <p className="text-neutral-700">{body}</p>
            </div>
        </div>
    );
}
