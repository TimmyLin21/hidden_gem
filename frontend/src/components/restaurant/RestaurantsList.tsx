import type { Restaurant, RestaurantMetadataResponse } from '@/api/restaurants'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import StarRating from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { CircleDollarSign, Earth, MapPin, Phone, Toilet, Utensils } from 'lucide-react'
import { purifyRestaurantTypes } from '@/routes'
import { Link } from '@tanstack/react-router'
import { RestaurantsPagination } from './RestaurantsPagination'

export function RestaurantsList(
    {
        isPending,
        isFetching,
        error,
        data,
        onHover,
        onSelect,
    }: {
        isPending: boolean;
        isFetching: boolean;
        error: unknown;
        data: RestaurantMetadataResponse | undefined;
        onHover?: (id: string | null) => void;
        onSelect?: (id: string) => void;
    }
) {
    return (
        <>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6 my-4">
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
                ) : data && data.data.length > 0 ? (
                    data.data.map((restaurant: Restaurant) => (
                        <li
                            onClick={() => onSelect ? onSelect(restaurant.ID) : undefined}
                            onMouseEnter={() => onHover ? onHover(restaurant.ID) : undefined}
                            onMouseLeave={() => onHover ? onHover(null) : undefined}
                            key={restaurant.ID}
                            id={`restaurant-${restaurant.ID}`}
                            className="h-full">
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
                                        <span className='w-4 mr-2'>
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
            <RestaurantsPagination meta={data?.meta} />
        </>
    )
}