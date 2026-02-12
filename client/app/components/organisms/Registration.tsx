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

export default function Registration({ setRegister, openLogin }: { setRegister: any, openLogin: any }){    
    return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/50 overflow-hidden animate-in fade-in duration-300"
        onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setRegister(false);
                }
            }}>
        <Card className="w-full max-w-sm zoom-in-95 duration-300">
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
    </Card></div> 
    );
}