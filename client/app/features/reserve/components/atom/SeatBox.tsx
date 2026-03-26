import { useNavigate } from "react-router";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import type { SeatOccupantPreview } from "~/features/reserve/types/reserve.types";

interface SeatBoxProps {
    seatNumber: number;
    checked: boolean;
    disabled: boolean;
    occupantPreview?: SeatOccupantPreview;
    onSelect: (seatNumber: number) => void;
}

export default function SeatBox({
    seatNumber,
    checked,
    disabled,
    occupantPreview,
    onSelect,
}: SeatBoxProps) {
    const navigate = useNavigate();

    function handleAvatarClick(e: React.MouseEvent) {
        if (occupantPreview?.visibleUserId) {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/dashboard/profile/${occupantPreview.visibleUserId}`);
        }
    }

    const isNavigable = !!occupantPreview?.visibleUserId;

    return (
        <Tooltip key="top">
            <TooltipTrigger asChild>
                <Checkbox
                    className="size-6 bg-white"
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={() => onSelect(seatNumber)}
                />
            </TooltipTrigger>
            <TooltipContent>
                <div className="flex items-center gap-2">
                    {occupantPreview && (
                        <img
                            src={occupantPreview.profilePictureUrl || "/profile.png"}
                            alt="occupant"
                            className={`size-5 rounded-full object-cover${isNavigable ? " cursor-pointer hover:ring-2 hover:ring-green-400" : ""}`}
                            onClick={handleAvatarClick}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/profile.png";
                            }}
                        />
                    )}
                    <span
                        className={isNavigable ? "cursor-pointer underline decoration-dotted" : ""}
                        onClick={handleAvatarClick}
                    >
                        {occupantPreview?.label
                            ? `Seat ${seatNumber} — ${occupantPreview.label}`
                            : `Seat ${seatNumber}`}
                    </span>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
