import AboutCard from "./AboutCard";

export default function AboutSection() {
    return (
        <div className="flex flex-col items-center gap-8 py-10 px-20 ">
            <h1 className="text-2xl font-medium">What is ArchersReserve?</h1>
            <div className="flex justify-center gap-4 w-full">
                <AboutCard
                    heading="Smart Scheduling"
                    body="Plan your week with precision. Reserve 30-minute intervals across a 7-day window,
                    ensuring your workstation is ready when you are."
                />
                <AboutCard
                    heading="Smart Scheduling"
                    body="Plan your week with precision. Reserve 30-minute intervals across a 7-day window,
                    ensuring your workstation is ready when you are."
                />
                <AboutCard
                    heading="Smart Scheduling"
                    body="Plan your week with precision. Reserve 30-minute intervals across a 7-day window,
                    ensuring your workstation is ready when you are."
                />
                <AboutCard
                    heading="Smart Scheduling"
                    body="Plan your week with precision. Reserve 30-minute intervals across a 7-day window,
                    ensuring your workstation is ready when you are."
                />
            </div>
        </div>
    );
}
