import { Button } from "~/components/ui/button";
import { NavLink } from "react-router";
import { FaUserLarge } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";

import { useAuthStore } from "~/store/user.store";
import { useState } from "react";
import Login from "~/components/organisms/Login";
import Registration from "~/components/organisms/Registration";

export default function HeroSection() {
    const currentUser = useAuthStore((state) => state.currentUser);

    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    const [sheetOpen, setSheetOpen] = useState(false);
    const openRegister = () => {
        setSheetOpen(false);
        setLogin(false);
        setRegister(true);
    };

    const openLogin = () => {
        setSheetOpen(false);
        setLogin(true);
        setRegister(false);
    };

    return (
        <>
            <div className="bg-[url(hero.jpg)] bg-no-repeat bg-cover bg-center text-center w-screen">
                <div className="bg-primary/80 py-35 px-15 flex flex-col justify-center items-center gap-6 px-10">
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="font-bold text-5xl">
                            Skip the search, Secure your spot.
                        </h1>
                        <p className="text-neutral-800">
                            Real-time seat maps for every lab. Book your 30-minute slot, and
                            actually finish your work.
                        </p>
                    </div>

                    {currentUser === null ? (
                        <div className="flex gap-4">
                            <Button
                                onClick={openLogin}
                                className="px-8 py-[6px] bg-neutral-50 text-neutral-950 rounded-md border-neutral-400 border-2 "
                            >
                                Book a slot
                            </Button>
                            <Button
                                onClick={openLogin}
                                className="px-8 py-[6px] text-neutral-50 bg-neutral-800 rounded-md border-neutral-600 border-2 "
                            >
                                My Reservations
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4">
                            <NavLink to="dashboard/profile" className="w-full">
                                {({ isActive }) => (
                                    <Button
                                        variant={isActive ? "default" : "outline"}
                                        className="px-8 py-[6px] bg-neutral-50 text-neutral-950 rounded-md border-neutral-400 border-2 "
                                    >
                                        Book a slot
                                    </Button>
                                )}
                            </NavLink>
                            <NavLink to="dashboard/lab" className="w-full">
                                {({ isActive }) => (
                                    <Button
                                        variant={isActive ? "default" : "outline"}
                                        className="px-8 py-[6px] text-neutral-50 bg-neutral-800 rounded-md border-neutral-600 border-2 "
                                    >
                                        My Reservations
                                    </Button>
                                )}
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>

            {login === false ? (
                <></>
            ) : (
                <Login setLogin={setLogin} openRegister={openRegister} />
            )}

            {register === false ? (
                <></>
            ) : (
                <Registration setRegister={setRegister} openLogin={openLogin} />
            )}
        </>
    );
}
