import type { InfoCard } from "../../types/landing.types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AboutCard({ heading, body }: InfoCard) {
    return (
        <Card className="w-full border-slate-200 shadow-sm">
            <CardHeader>
            <CardTitle className="text-xl font-bold">{heading}</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="leading-relaxed text-[#2a3a2a]">
                {body}
            </p>
            </CardContent>
        </Card>
    );
}
