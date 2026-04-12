import { Button } from "@/components/ui/Button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/Drawer"
import { X } from "lucide-react"
import { Toggle } from "./Toggle"
import React from "react"

const FILTERS = [
    {
        label: "Cuisine",
        options: [
            { label: "Italian", value: "italian" },
            { label: "Chinese", value: "chinese" },
            { label: "Mexican", value: "mexican" },
        ]
    },
    {
        label: "Price",
        options: [
            { label: "$", value: 1 },
            { label: "$$", value: 2 },
            { label: "$$$", value: 3 },
        ]
    },
    {
        label: "Rating",
        options: [
            { label: "3 stars & up", value: 3 },
            { label: "4 stars & up", value: 4 },
            { label: "4.5 stars & up", value: 4.5 },
        ]
    },
    {
        label: "Restroom",
        options: [
            { label: "Yes", value: "yes" },
        ]
    }
]

interface FilterState {
    cuisine: Record<string, boolean>;
    price: string | null;
    rating: string | null;
    restroom: string | null;
}

export function Filters({ children }: { children: React.ReactNode }) {
    const [pressed, setPressed] = React.useState<FilterState>({
        cuisine: {
            italian: false,
            chinese: false,
            mexican: false,
        },
        price: null,
        rating: null,
        restroom: null,
    })

    const handlePressedChange = (category: string, value: string) => {
        setPressed((prev) => {
            switch (category) {
                case "cuisine":
                    return {
                        ...prev,
                        cuisine: {
                            ...prev.cuisine,
                            [value]: !prev.cuisine[value as keyof typeof prev.cuisine],
                        }
                    }
                case "price":
                case "rating":
                case "restroom":
                    return {
                        ...prev,
                        [category]: prev[category] === value ? null : value
                    }
                default:
                    return prev

            }
        })

    }
    const handleReset = () => {
        setPressed({
            cuisine: {
                italian: false,
                chinese: false,
                mexican: false,
            },
            price: null,
            rating: null,
            restroom: null,
        })
    }

    return (
        <Drawer
            direction="left"
        >
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="w-full! max-w-none! rounded-none!">
                <DrawerHeader className="flex flex-col">
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" rounded="full" className="self-end">
                            <X />
                            <span className="sr-only">Cancel</span>
                        </Button>
                    </DrawerClose>
                    <DrawerTitle className="text-3xl">Filters</DrawerTitle>
                    <DrawerDescription>
                        Set your filter preferences.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="no-scrollbar overflow-y-auto px-4">
                    {
                        FILTERS.map((filter) => (
                            <div key={filter.label} className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    {filter.label}
                                </h3>
                                <div className="flex gap-2">
                                    {
                                        filter.options.map((option) => (
                                            <Toggle
                                                key={option.value}
                                                aria-label={`Toggle ${option.label}`}
                                                variant="outline"
                                                rounded="full"
                                                className="mb-2"
                                                pressed={
                                                    filter.label === "Cuisine"
                                                        ? pressed.cuisine[option.label as keyof typeof pressed.cuisine]
                                                        : pressed[filter.label.toLowerCase() as keyof Omit<FilterState, "cuisine">] === option.label
                                                }
                                                onPressedChange={() => handlePressedChange(filter.label.toLowerCase(), option.label)}
                                            >
                                                {option.label}
                                            </Toggle>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <DrawerFooter className="flex-row justify-between">
                    <Button variant="link" rounded="full" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button variant="secondary" rounded="full">
                        Apply
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
