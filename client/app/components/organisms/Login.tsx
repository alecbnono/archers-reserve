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

export default function Login({ setLogin, openRegister }: { setLogin: any, openRegister: any }){
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/50 overflow-hidden animate-in fade-in duration-300"
        onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setLogin(false);
                }
            }}>
        <Card className="w-full max-w-sm zoom-in-95 duration-300">
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
        </Card> </div> 
    )
}