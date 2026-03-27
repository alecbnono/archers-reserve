import AboutCard from "../molecules/AboutCard";


export default function AboutContent() {
    return (
        <div className="flex flex-col gap-8 py-10 px-10 md:px-20 items-stretch w-full max-w-4xl mx-auto">
            <AboutCard
                heading="Smart Scheduling"
                body="Plan your week with precision. Reserve 30-minute intervals across a 7-day window,
                ensuring your workstation is ready when you are."
            />
            <AboutCard
                heading="Visual Lab "
                body="Skip the physical log sheets. Head to our interactive map with real-time laboratory occupancy 
                and pick your preferred seat, just like a movie theater."
            />
            <AboutCard
                heading="Live feedback"
                body="Real-time updates on available slots and upcoming sessions. Filter by date, time, 
                or specific building to find the desired laboratory in seconds."
            />
        </div>
    );
}
