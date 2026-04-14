import { Button } from "@/components/ui/Button"
import { Toggle } from "../ui/Toggle"
import { type FilterState } from "@/routes"


export function FiltersSidebar({
    FILTERS,
    handlePressedChange,
    handleReset,
    handleApply,
    pressed }:
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
    }) {


    return (
        <>
            <div className="no-scrollbar overflow-y-auto">
                {
                    FILTERS.map((filter) => (
                        <div key={filter.label} className="mb-4">
                            <h3 className="font-semibold mb-2">
                                {filter.label}
                            </h3>
                            <div className="flex flex-col gap-2">
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
                                                className="mb-2 w-fit font-light"
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
            <footer className="border-t-2 border-neutral-500 pt-2">
                <Button variant="link" rounded="full" onClick={handleReset}>
                    Reset
                </Button>
                <Button variant="secondary" rounded="full" onClick={handleApply}>
                    Apply
                </Button>
            </footer>
        </>

    )
}
