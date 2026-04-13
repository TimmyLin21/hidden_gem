import { fetchRestaurants } from '@/api/restaurants'
import { Button } from '@/components/ui/Button'
import { Filters } from '@/components/ui/Filters'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CircleDollarSign, Earth, Filter, Map, MapPin, Phone, Toilet, Utensils } from 'lucide-react'
import React from 'react'
import type { Restaurant } from '@/api/restaurants'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import StarRating from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'

export const Route = createFileRoute('/')({
    component: Home,
})

export const FILTERS = [
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

export interface FilterState {
    cuisine: Record<string, boolean>;
    price: string | null;
    rating: string | null;
    restroom: string | null;
}

function Home() {
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
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () => fetchRestaurants(
            pressed.rating ? parseFloat(pressed.rating) : undefined,
            pressed.price ? parseInt(pressed.price) : undefined,
            Object.keys(pressed.cuisine).filter((key) => pressed.cuisine[key as keyof typeof pressed.cuisine]),
            pressed.restroom === "yes" ? true : undefined),
    })
    return (
        <main className="container flex flex-col w-full gap-x-6 mb-12 mx-auto">
            <div className="flex justify-between w-full">
                <Filters pressed={pressed} setPressed={setPressed}>
                    <Button variant="outline" size="lg" rounded="full">
                        <Filter /> Filters
                    </Button>
                </Filters>
                <Button variant="secondary" size="lg" rounded="full">
                    <Map /> Map
                </Button>
            </div>
            <ul className="flex flex-col gap-4 mt-4">
                {isPending || isFetching ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {(error as Error).message}</p>
                ) : data && data.length > 0 ? (
                    data.map((restaurant: Restaurant) => (
                        <li key={restaurant.ID}>
                            <Card className="mx-auto">
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
                                    {restaurant.Types.filter((type) => !["point_of_interest", "restaurant", "food", "establishment"].includes(type)).length > 0 && (
                                        <p className='flex items-center gap-x-4'>
                                            <span className='w-4'>
                                                <Utensils />
                                                <span className="sr-only">Types: </span>
                                            </span>
                                            <span className='flex gap-x-2'>
                                                {
                                                    restaurant.Types.filter((type) => !["point_of_interest", "restaurant", "food", "establishment"].includes(type)).map((type) => (
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
        </main>
    )
}