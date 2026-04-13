import { fetchRestaurants, fetchRestaurantTypes } from '@/api/restaurants'
import { Button } from '@/components/ui/Button'
import { FiltersDrawer } from '@/components/ui/FiltersDrawer'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CircleDollarSign, Earth, Filter, Map, MapPin, Phone, Toilet, Utensils } from 'lucide-react'
import React from 'react'
import type { Restaurant } from '@/api/restaurants'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import StarRating from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'
import { FiltersSidebar } from '@/components/ui/FiltersSidebar'
import { Skeleton } from '@/components/ui/Skeleton'

export const Route = createFileRoute('/')({
    validateSearch: (search: Record<string, unknown>): RestaurantSearch => {
        return {
            query: typeof search.query === "string" ? search.query : undefined,
            types: Array.isArray(search.types) ? search.types : undefined,
            price_level: typeof search.price_level === "number" ? search.price_level : undefined,
            rating: typeof search.rating === "number" ? search.rating : undefined,
            restroom: typeof search.restroom === "boolean" ? search.restroom : undefined,
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

function purifyRestaurantTypes(types: string[]): string[] {
    return types.filter((type) => !["point_of_interest", "restaurant", "food", "establishment"].includes(type));
}

function Home() {
    const navigate = useNavigate();
    const { query, types, price_level, rating, restroom } = Route.useSearch();
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
        <main className="container flex w-full gap-x-6 md:gap-x-12 mb-12 mx-auto">
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
                    <Button variant="secondary" size="lg" rounded="full" className="ml-auto">
                        <Map /> Map
                    </Button>
                </div>
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6 mt-4">
                    {isPending || isFetching ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <li key={index} className="h-full">
                                <Card className="mx-auto h-full pt-0">
                                    <Skeleton className="w-full aspect-video object-cover" />
                                    <CardHeader>
                                        <CardTitle>
                                            <Skeleton className="h-6 w-3/4 mb-2" />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex flex-col gap-2'>
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </CardContent>
                                </Card>
                            </li>
                        ))
                    ) : error ? (
                        <p>Error: {(error as Error).message}</p>
                    ) : data && data.length > 0 ? (
                        data.map((restaurant: Restaurant) => (
                            <li key={restaurant.ID} className="h-full">
                                <Card className="mx-auto h-full">
                                    <img
                                        src={restaurant.ImageUrl.Valid ? restaurant.ImageUrl.String : "https://via.placeholder.com/400x200?text=No+Image"}
                                        alt={restaurant.Name}
                                        className="w-full aspect-video object-cover"
                                    />
                                    <CardHeader className="">
                                        <CardAction>
                                            <p className="w-fit">
                                                Google Rating: {restaurant.Rating}
                                            </p>
                                            <StarRating max={5} init={restaurant.Rating} disabled />
                                        </CardAction>
                                        <CardTitle>{restaurant.Name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex flex-col gap-2'>
                                        {purifyRestaurantTypes(restaurant.Types).length > 0 && (
                                            <p className='flex items-center gap-x-4'>
                                                <span className='w-4'>
                                                    <Utensils />
                                                    <span className="sr-only">Types: </span>
                                                </span>
                                                <span className='flex gap-x-2'>
                                                    {
                                                        purifyRestaurantTypes(restaurant.Types).map((type) => (
                                                            <Badge key={type} variant="outline">
                                                                {type.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                                            </Badge>
                                                        ))
                                                    }
                                                </span>

                                            </p>)}
                                        {restaurant.PriceLevel > 1 && (<p className="flex items-center gap-x-2">
                                            <span className='w-4'>
                                                <CircleDollarSign />
                                                <span className="sr-only">Price Level: </span>
                                            </span>
                                            <span>
                                                {
                                                    "$".repeat(restaurant.PriceLevel - 1)
                                                }
                                            </span>
                                        </p>)}
                                        <p className='flex items-center gap-x-4'>
                                            <span className='w-4'>
                                                <MapPin />
                                                <span className="sr-only">Address: </span>
                                            </span>
                                            <span>{restaurant.Address}</span>
                                        </p>
                                        {restaurant.Website.Valid && <p className='flex items-center gap-x-4'>
                                            <span className='w-4'>
                                                <Earth />
                                                <span className="sr-only">Website: </span>
                                            </span>
                                            <Link to={restaurant.Website.String} target="_blank" rel="noopener noreferrer" className='hover:text-blue-400 transition-colors duration-300'>
                                                {restaurant.Website.String}
                                            </Link>
                                        </p>}
                                        {restaurant.Telephone.Valid && <p className='flex items-center gap-x-4'>
                                            <span className='w-4'>
                                                <Phone />
                                                <span className="sr-only">Phone: </span>
                                            </span>
                                            <span>
                                                {restaurant.Telephone.String}
                                            </span>
                                        </p>}

                                        {
                                            restaurant.Restroom !== undefined && (
                                                <p className='flex items-center gap-x-4'>
                                                    <span className='w-4'>
                                                        <Toilet />
                                                        <span className="sr-only">Restroom: </span>
                                                    </span>
                                                    <span>
                                                        Restroom Avaiable
                                                    </span>
                                                </p>)
                                        }
                                    </CardContent>
                                </Card>
                            </li>
                        ))
                    ) : (
                        <p>No restaurants found.</p>
                    )}
                </ul>
            </section>
        </main>
    )
}