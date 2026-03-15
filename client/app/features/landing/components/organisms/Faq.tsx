import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion";
import { faqItems } from "../../data/faq";

export default function Faq() {
    return (
        <div className="flex flex-col items-center gap-5 py-10 px-20 md:max-w-150 w-screen">
            <h1 className="text-2xl font-medium">Frequently Asked Questions</h1>
            <Accordion type="single" collapsible defaultValue="item-1">
                {faqItems.map((item) => (
                    <AccordionItem key={item.value} value={item.value}>
                        <AccordionTrigger>{item.trigger}</AccordionTrigger>
                        <AccordionContent>{item.content}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
