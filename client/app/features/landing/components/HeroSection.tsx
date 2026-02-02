import { Button } from "~/components/ui/button";

export default function HeroSection() {
    return (
        <div className="bg-[url(hero.jpg)] bg-no-repeat bg-cover bg-center">
            <div className="bg-primary/80 h-100 flex flex-col justify-center items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="font-bold text-5xl">
                        Skip the search, Secure your spot.
                    </h1>
                    <p className="text-neutral-800">
                        Real-time seat maps for every lab. Book your 30-minute slot, and
                        actually finish your work.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button className="px-8 py-[6px] bg-neutral-50 text-neutral-950 rounded-md border-neutral-400 border-2 ">
                        Book a slot
                    </Button>

                    <Button className="px-8 py-[6px] text-neutral-50 bg-neutral-800 rounded-md border-neutral-600 border-2 ">
                        My Reservations
                    </Button>
                </div>
            </div>
        </div>
    );
}
