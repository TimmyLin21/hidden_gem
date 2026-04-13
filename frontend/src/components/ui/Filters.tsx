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
import { FILTERS, type FilterState } from "@/routes"


export function Filters({
    pressed,
    setPressed,
    children }:
    {
        pressed: FilterState;
        setPressed: React.Dispatch<React.SetStateAction<FilterState>>; children: React.ReactNode
    }) {
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
                Italian: false,
                Chinese: false,
                Mexican: false,
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
