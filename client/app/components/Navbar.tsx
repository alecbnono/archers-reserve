import { LuScreenShare } from "react-icons/lu";
import { NavLink } from "react-router";
import { useState } from 'react';
import Registration from "./Registration";
import Login from "./Login";

export default function Navbar() {

    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    const openRegister = () => {
        setLogin(false);
        setRegister(true);
    }

    const openLogin = () => {
        setLogin(true);
        setRegister(false);
    }

    return (
        <>
        <nav className="flex py-5 px-10 justify-between">
            <div className="flex items-center gap-2">
                <LuScreenShare size={24} />
                <p className="font-medium">ArchersReserve</p>
            </div>
            <div className="flex gap-4">
                <p className="hover:cursor-pointer"
                    onClick={ openLogin
                    }>Login</p>
                <p  className="hover:cursor-pointer"
                    onClick={ openRegister
                    }>Register</p>
            </div>
        </nav>

        { (login === false) ? (<></>) :  
        (<Login setLogin={setLogin} openRegister={openRegister}/>  )}

        { (register === false) ? (<></>) : 
        (<Registration setRegister={setRegister} openLogin={openLogin}/> )
}    
        </>
    );
}
