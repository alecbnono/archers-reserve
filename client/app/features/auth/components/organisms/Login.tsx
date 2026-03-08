import { Checkbox } from "~/components/ui/checkbox"
import { Button } from "~/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

import { useLoginForm } from "../../hooks/useLoginForm"

interface LoginProps {
    setLogin: (open: boolean) => void;
    openRegister: () => void;
}

export default function Login({ setLogin, openRegister }: LoginProps) {

    const { form, errors, serverError, handleChange, handleRememberChange, handleSubmit } = useLoginForm();

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
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john.doe@dlsu.edu.ph"
                                    required
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={8}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <Checkbox id="is-remembered" name="isRemembered" checked={form.isRemembered} onCheckedChange={handleRememberChange} />
                                <Label htmlFor="is-remembered">Remember?</Label>
                            </div>
                            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
                            <Button type="submit" className="w-full text-white" >
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card></div>
    )
}
