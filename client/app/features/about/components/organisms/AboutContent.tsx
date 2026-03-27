import AboutCard from "../molecules/AboutCard";


export default function AboutContent() {
    return (
        <div className="flex flex-col gap-4 py-10 px-10 md:px-20 items-stretch w-full max-w-4xl mx-auto">
            <AboutCard
                heading="Our Mission"
                body="To provide an efficient, reliable, and user-friendly platform that streamlines laboratory reservations, 
                maximizes resource utilization, and support academic excellence."
            />
            <AboutCard
                heading="Frontend Dependencies and Libraries Used"
                body={
                    <>
                        <ul className="space-y-4">
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">React</span> — UI library for building component-based user interfaces
                            </li>
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">Vite</span> — Fast build tool used by client app
                            </li>
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">TailwindCSS</span> — CSS framework for rapid UI development
                            </li>
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">Radix UI</span> —  Accessible, unstyled components for building components
                            </li>
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">Lucide</span> — Icon library for React applications
                            </li>
                        </ul>
                    </>
                }
            />
            <AboutCard
                heading="Backend Dependencies and Libraries Used"
                body={
                    <>
                        <ul className="space-y-4">
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">Node.js</span> — JavaScript runtime for executing frontend tooling and backend server code
                            </li>
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">Express</span> — Backend web framework defining routes and middleware
                            </li>
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">PostgreSQL</span> — Relational database management system
                            </li>                            
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">Docker</span> — Container platform for application deployment
                            </li>
                            <li className="text-[#2a3a2a]">
                            <span className="font-bold">Bcrypt</span> —  Password hashing library for credential storage
                            </li>
                        </ul>
                    </>
                }
            />
            <AboutCard
                heading="Contact Us"
                body={
                    <>
                        <p className="text-[#2a3a2a]">
                            Have feedback, suggestions, or need help? Contact us below, and we'll assist you as soon as possible.
                        </p>
                        <div className="pt-2">
                            <p className="text-sm">
                                <span className="font-bold">Email:</span>
                                <a
                                    href="mailto:jean_ponce@dlsu.edu.ph"
                                    className="ml-2 hover:underline transition-colors"
                                >
                                    jean_ponce@dlsu.edu.ph
                                </a>
                            </p>
                        </div>
                    </>
                }
            />
        </div>
    );
}
