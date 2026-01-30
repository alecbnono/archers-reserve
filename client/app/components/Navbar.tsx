import { LuScreenShare } from "react-icons/lu";
import { NavLink } from "react-router";
import { useState } from 'react';
import { Button } from "~/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

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
                    onClick={() => { openLogin
                    }}>Login</p>
                <p  className="hover:cursor-pointer"
                    onClick={() => { openRegister
                    }}>Register</p>
            </div>
        </nav>

        { (login === false) ? (<></>) :  
        (
        <div className="absolute flex h-screen w-screen items-center justify-center bg-neutral-800/50"><Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                    <button type="button" onClick={openRegister} className=" text-sm font-bold hover:underline">
                        Sign up
                    </button>
                </CardAction>
        </CardHeader>
        <CardContent>
            <form>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@dlsu.edu.ph"
                    required
                />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                        Forgot your password?
                        </a>
                    </div>
                    <Input id="password" type="password" required />
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full text-white">
            Login
            </Button>
        </CardFooter>
        </Card> </div> )}


        { (register === true) ? (<></>) : 
        (
        <div className="absolute flex h-screen w-screen items-center justify-center bg-neutral-800/50"><Card className="w-full max-w-sm">
       <CardHeader>
           <CardTitle>Create an account</CardTitle>
            <CardDescription>
            Enter your information below to create your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                    />
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@dlsu.edu.ph"
                            required
                        />
                        </div>  

                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Confirm your password</Label>
                        <Input id="password" type="confirm-password" required />

                    </div>
                        <Button type="submit" className="text-white">Create Account</Button>
                        <Button variant="outline" type="button">
                        Sign up with Google
                        </Button>
                        <div className="flex gap-1 items-center">
                            <p className="text-gray-500">Already have an account?  </p>
                            <button type="button" onClick={openLogin} className="font-bold hover:underline">
                                Sign in
                            </button>
                        </div>
  
                    </div>
            </form>
      </CardContent>
    </Card></div> )
}    
        </>
    );
}
