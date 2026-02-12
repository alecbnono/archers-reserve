import { LuScreenShare } from "react-icons/lu";
import { Button } from "../ui/button";
import { useState } from 'react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";
import { NavLink } from "react-router";
import Registration from "./Registration";
import Login from "./Login";


export default function Navbar() {

    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    const [sheetOpen, setSheetOpen] = useState(false);
    const openRegister = () => {
        setSheetOpen(false);
        setLogin(false);
        setRegister(true);
    }

    const openLogin = () => {
        setSheetOpen(false);
        setLogin(true);
        setRegister(false);
    }
    
    return (
        <>
            <nav className="hidden md:flex py-5 px-10 justify-between">
                <div className="flex items-center gap-2">
                    <LuScreenShare size={24} />
                    <p className="font-medium">ArchersReserve</p>
                </div>
                <div className="flex gap-4">
                    <p className="hover:cursor-pointer hover:underline" onClick={openLogin}>Login</p>
                    <p className="hover:cursor-pointer hover:underline" onClick={openRegister}>Register</p>
                </div>
            </nav>
            <div className="flex justify-between md:hidden px-4 py-4">
                <div className="flex items-center gap-2">
                    <LuScreenShare size={24} />
                    <p className="font-medium">ArchersReserve</p>
                </div>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="p-0" variant="outline">
                            <IoMenu size={48} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col p-10 pt-15">
                        <div className="flex flex-col gap-4">
                            <Button variant="outline" onClick={ openLogin }>Login</Button>
                            <Button variant="outline" onClick={ openRegister }>Register</Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

        { (login === false) ? (<></>) :  
        (<Login setLogin={setLogin} openRegister={openRegister}/>  )}

        { (register === false) ? (<></>) : 
        (<Registration setRegister={setRegister} openLogin={openLogin}/> )}    
        </>
        
    );
}
