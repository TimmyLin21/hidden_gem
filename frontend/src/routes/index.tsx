import { fetchRestaurants, fetchRestaurantTypes } from '@/api/restaurants'
import { Button } from '@/components/ui/Button'
import { FiltersDrawer } from '@/components/restaurant/FiltersDrawer'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Filter, Map } from 'lucide-react'
import React from 'react'

import { FiltersSidebar } from '@/components/restaurant/FiltersSidebar'
import { RestaurantsList } from '@/components/restaurant/RestaurantsList'
import { cn } from '@/lib/utils'
import { MapView } from '@/components/restaurant/MapView'


export const Route = createFileRoute('/')({
    validateSearch: (search: Record<string, unknown>): RestaurantSearch => {
        return {
            query: typeof search.query === "string" ? search.query : undefined,
            types: Array.isArray(search.types) ? search.types : undefined,
            price_level: typeof search.price_level === "number" ? search.price_level : undefined,
            rating: typeof search.rating === "number" ? search.rating : undefined,
            restroom: typeof search.restroom === "boolean" ? search.restroom : undefined,
            showMap: typeof search.showMap === "boolean" ? search.showMap : undefined,
        };
    },
    component: Home,
})

type RestaurantSearch = {
    query?: string;
    types?: string[];
    price_level?: number;
    rating?: number;
    restroom?: boolean;
    showMap?: boolean;
}

export interface FilterState {
    cuisine: Record<string, boolean>;
    price: string | null;
    rating: string | null;
    restroom: string | null;
}

function getInitialFilterState(
    restaurantTypes: string[] | undefined,
    types: string[] | undefined,
    price_level: number | undefined,
    rating: number | undefined,
    restroom: boolean | undefined
): FilterState {
    const cusineState: Record<string, boolean> = {};
    purifyRestaurantTypes(restaurantTypes || []).forEach((type) => {
        cusineState[type] = (types || []).includes(type);
    })
    const initialState = {
        cuisine: cusineState,
        price: price_level !== undefined ? price_level.toString() : null,
        rating: rating !== undefined ? rating.toString() : null,
        restroom: restroom !== undefined ? restroom.toString() : null,
    }


    return initialState
}

export function purifyRestaurantTypes(types: string[]): string[] {
    return types.filter((type) => !["point_of_interest", "restaurant", "food", "establishment"].includes(type));
}

function Home() {
    const navigate = useNavigate();
    const { query, types, price_level, rating, restroom, showMap } = Route.useSearch();
    const { data: restaurantTypes } = useQuery({
        queryKey: ["restaurantTypes"],
        queryFn: () => fetchRestaurantTypes(),
    })
    const FILTERS = React.useMemo(() => {
        if (!restaurantTypes) return [];

        return [
            {
                label: "Cuisine",
                options: purifyRestaurantTypes(restaurantTypes).map((type: string) => ({
                    label: type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
                    value: type,
                }))
            },
            {
                label: "Price",
                options: [
                    { label: "$", value: 2 },
                    { label: "$$", value: 3 },
                    { label: "$$$", value: 4 },
                ]
            },
            {
                label: "Rating",
                options: [
                    { label: "3+", value: 3 },
                    { label: "4+", value: 4 },
                    { label: "4.5+", value: 4.5 },
                ]
            },
            {
                label: "Restroom",
                options: [{ label: "Yes", value: true }]
            }
        ];
    }, [restaurantTypes]);
    const [pressed, setPressed] = React.useState<FilterState>(getInitialFilterState(restaurantTypes, types, price_level, rating, restroom));
    const { isPending, error, data, isFetching } = useQuery({
        // Refetch data whenever any of the search parameters change
        queryKey: ["restaurants", { query, types, price_level, rating, restroom }],
        queryFn: () => fetchRestaurants(
            rating != undefined ? rating : undefined,
            price_level != undefined ? price_level : undefined,
            types,
            restroom != undefined ? restroom : undefined,
            query != undefined ? query : undefined),
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
        setPressed(getInitialFilterState(restaurantTypes, types, price_level, rating, restroom));
    }
    const handleApply = () => {
        const activeTypes = Object.entries(pressed.cuisine)
            .filter(([_, isActive]) => isActive)
            .map(([value, _]) => value);

        navigate({
            to: "/",
            search: {
                query: query || undefined,
                rating: pressed.rating ? parseFloat(pressed.rating) : undefined,
                price_level: pressed.price ? parseInt(pressed.price) : undefined,
                types: activeTypes.length > 0 ? activeTypes : undefined,
                restroom: pressed.restroom === "true" || pressed.restroom === "yes" ? true : undefined,
                showMap: showMap ? true : undefined,
            }
        })
    }
    const handleShowMap = () => {
        navigate({
            to: "/",
            search: {
                query,
                rating,
                price_level,
                types,
                restroom,
                showMap: true,
            }
        })
    }

    const handleCloseMap = () => {
        navigate({
            to: "/",
            search: {
                query,
                rating,
                price_level,
                types,
                restroom,
                showMap: undefined,
            }
        })
    }

    // Sync pressed state with URL search params on initial load and when restaurantTypes are fetched
    React.useEffect(() => {
        if (restaurantTypes) {
            setPressed(getInitialFilterState(restaurantTypes, types, price_level, rating, restroom));
        }
    }, [restaurantTypes, types, price_level, rating, restroom]);

    return (
        <main className={
            cn(
                "w-full mx-auto",
                !showMap && "container flex gap-x-6 md:gap-x-12 mb-12",
                showMap && "flex flex-col h-dvh overflow-hidden"
            )
        }>
            {
                !showMap && (
                    <>
                        <section className="hidden md:block">
                            <FiltersSidebar
                                FILTERS={FILTERS}
                                pressed={pressed}
                                handleReset={handleReset}
                                handleApply={handleApply}
                                handlePressedChange={handlePressedChange} />
                        </section>
                        <section className="flex-1 min-w-0">
                            <div className="flex justify-between w-full">
                                <FiltersDrawer
                                    FILTERS={FILTERS}
                                    pressed={pressed}
                                    handleReset={handleReset}
                                    handleApply={handleApply}
                                    handlePressedChange={handlePressedChange}>
                                    <Button variant="outline" size="lg" rounded="full" className="md:hidden">
                                        <Filter /> Filters
                                    </Button>
                                </FiltersDrawer>
                                <Button variant="secondary" size="lg" rounded="full" className="ml-auto" onClick={handleShowMap}>
                                    <Map /> Map
                                </Button>
                            </div>
                            <RestaurantsList
                                isPending={isPending}
                                isFetching={isFetching}
                                error={error}
                                data={data}
                            />
                        </section>
                    </>
                )
            }
            {
                showMap && (
                    <>
                        <MapView
                            data={data}
                            handleCloseMap={handleCloseMap}
                        />

                        <section className="flex-1 min-w-0 py-4 overflow-y-auto px-4 relative" id="restaurant-list-container">
                            <div
                                className="flex justify-between w-full"
                            >
                                <FiltersDrawer
                                    FILTERS={FILTERS}
                                    pressed={pressed}
                                    handleReset={handleReset}
                                    handleApply={handleApply}
                                    handlePressedChange={handlePressedChange}>
                                    <Button variant="outline" size="lg" rounded="full" className="md:hidden">
                                        <Filter /> Filters
                                    </Button>
                                </FiltersDrawer>
                            </div>
                            <RestaurantsList
                                isPending={isPending}
                                isFetching={isFetching}
                                error={error}
                                data={data}

                            />
                        </section>

                    </>
                )
            }
        </main>
    )
}