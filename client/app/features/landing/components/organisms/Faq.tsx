import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion";

const items = [
    {
        value: "item-1",
        trigger: "How far in advance can I book a seat",
        content:
            'Users can view lab availability for the next 7 days, with the ability to select a specific week to reserve in.'
    },
    {
        value: "item-2",
        trigger: "Can I reserve multiple seats at the same time?",
        content:
            "Students are granted power to make 10 hours of reservations per week, while faculty can create recurring reservations for class schedules.",
    },
    {
        value: "item-3",
        trigger: "What happens if I am late for my reservation?",
        content:
            "There is a 10-minute grace period. If you have not arrived within the first 10 minutes, Faculty or Administrators have the authority to remove your reservation to free up the slot for others.",
    },
    {
        value: "item-4",
        trigger: "What is the difference between Student and Faculty accounts?",
        content:
            "Students can book single sessions, while Faculty have additional privileges like creating recurring weekly reservations and managing student arrival status.",
    },
];

export default function Faq() {
    return (
        <div className="flex flex-col items-center gap-5 py-10 px-20 md:max-w-150 w-screen">
            <h1 className="text-2xl font-medium">Frequently Asked Questions</h1>
            <Accordion type="single" collapsible defaultValue="item-1">
                {items.map((item) => (
                    <AccordionItem key={item.value} value={item.value}>
                        <AccordionTrigger>{item.trigger}</AccordionTrigger>
                        <AccordionContent>{item.content}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
