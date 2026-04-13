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
import { type FilterState } from "@/routes"


export function Filters({
    FILTERS,
    handlePressedChange,
    handleReset,
    handleApply,
    pressed,
    children }:
    {
        FILTERS: Array<{
            label: string;
            options: Array<{
                label: string;
                value: string | number | boolean;
            }>;
        }>;
        handlePressedChange: (filter: string, option: string) => void;
        handleReset: () => void;
        handleApply: () => void;
        pressed: FilterState;
        children: React.ReactNode
    }) {


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
                                        filter.options.map((option) => {
                                            const categoryKey = filter.label.toLowerCase() as keyof FilterState;
                                            const stringValue = String(option.value);

                                            return (
                                                <Toggle
                                                    key={option.label}
                                                    aria-label={`Toggle ${option.label}`}
                                                    variant="outline"
                                                    rounded="full"
                                                    className="mb-2"
                                                    pressed={
                                                        filter.label === "Cuisine"
                                                            ? !!pressed.cuisine[stringValue]
                                                            : pressed[categoryKey as keyof Omit<FilterState, "cuisine">] === stringValue
                                                    }
                                                    onPressedChange={() => handlePressedChange(filter.label.toLowerCase(), stringValue)}
                                                >
                                                    {option.label}
                                                </Toggle>
                                            )
                                        })
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
                    <Button variant="secondary" rounded="full" onClick={handleApply}>
                        Apply
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
