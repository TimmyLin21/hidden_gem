import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import React from "react"

export function RestaurantsSort({ showMap }: { showMap: boolean | undefined }) {
    const [open, setOpen] = React.useState(false)
    return (
        <Select
            defaultValue="rating"
            open={open}
            onOpenChange={() => {
                setOpen(!open)
                /*
                    A trick way to prevent body shift when opening the select dropdown
                */
                const body = document.body;
                const html = document.documentElement;
                const scrollbarWidth = (window.innerWidth - html.clientWidth);
                if (!open) {
                    if (!showMap) {
                        html.style.overflow = 'hidden'
                        body.style.overflow = 'hidden'
                        body.style.height = "100%"
                        body.style.marginRight = `${scrollbarWidth / 2}px`;
                    }
                } else {
                    if (!showMap) {
                        html.style.overflow = 'auto'
                        body.style.overflow = 'auto'
                        body.style.height = "auto"
                        body.style.marginRight = "0";
                    }
                }
            }}
        >
            <SelectTrigger className="w-45">
                <SelectValue placeholder="Preference" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}