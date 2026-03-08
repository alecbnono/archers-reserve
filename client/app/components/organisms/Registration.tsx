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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

import { useRegistrationForm } from "~/hooks/useRegistrationForm"

export default function Registration({ setRegister, openLogin }: { setRegister: any, openLogin: any }) {

    const { form, submitted, errors, handleChange, handleSubmit } = useRegistrationForm();

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
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <Tabs defaultValue="student" className="flex items-center w-full">
                                <TabsList>
                                    <TabsTrigger value="student">Student</TabsTrigger>
                                    <TabsTrigger value="faculty">Faculty</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First Name</Label>
                                <Input
                                    id="first-name"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    required

                                    value={form.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input
                                    id="last-name"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="john_doe"
                                    minLength={3}
                                    maxLength={20}
                                    required
                                    value={form.username}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john.doe@dlsu.edu.ph"
                                        required
                                        value={form.email}
                                        onChange={handleChange} />
                                </div>

                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password"
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    value={form.password}
                                    onChange={handleChange} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Confirm your password</Label>
                                <Input id="confirm-password"
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    minLength={8}
                                    value={form.confirmPassword}
                                    onChange={handleChange} />
                            </div>
                            <Button type="submit" className="text-white">Create Account</Button>

                            <div>
                                {errors.username && <p className="text-red-500">Username must be 3–20 characters and contain only letters, numbers, or _</p>}
                                {errors.email && <p className="text-red-500">Email should end with @dlsu.edu.ph</p>}
                                {errors.password && <p className="text-red-500">Passwords don't match</p>}
                            </div>
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
