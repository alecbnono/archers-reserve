import { Button } from "~/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

import { useRegistrationForm } from "~/features/auth/hooks/useRegistrationForm"

interface RegistrationProps {
    setRegister: (open: boolean) => void;
    openLogin: () => void;
}

export default function Registration({ setRegister, openLogin }: RegistrationProps) {

    const { form, errors, serverError, isSubmitting, successMessage, handleChange, handleSubmit, setRole } = useRegistrationForm();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        const success = await handleSubmit(e);
        if (success) {
            setTimeout(() => {
                setRegister(false);
                openLogin();
            }, 1500);
        }
    }

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
                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col gap-4">
                            <Tabs
                                defaultValue="STUDENT"
                                value={form.role}
                                onValueChange={setRole}
                                className="flex items-center w-full"
                            >
                                <TabsList>
                                    <TabsTrigger value="STUDENT">Student</TabsTrigger>
                                    <TabsTrigger value="FACULTY">Faculty</TabsTrigger>
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
                                    value={form.firstName}
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
                                    value={form.lastName}
                                    onChange={handleChange}
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
                                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john.doe@dlsu.edu.ph"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    value={form.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirm your password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    minLength={8}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>

                            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
                            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

                            <Button type="submit" className="text-white" disabled={isSubmitting || !!successMessage}>
                                {isSubmitting ? "Creating account..." : "Create Account"}
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
