import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { Restaurant } from "@/api/restaurants";
import { Button } from "../ui/Button";
import { Utensils, X } from "lucide-react";
import { createRoot } from "react-dom/client";
import { Badge } from "../ui/Badge";
import { purifyRestaurantTypes } from "@/routes";

interface MapProps {
    data: Restaurant[] | undefined;
    handleCloseMap: () => void;
}

function getRestaurantsTypesString(types: string[]): string {
    const purifiedTypes = purifyRestaurantTypes(types);
    return purifiedTypes.map((type) => {
        const words = type.split("_");
        return words.filter((word) => word !== "restaurant").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }).join(", ");
}

export const MapView = ({ data, handleCloseMap }: MapProps) => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token =
            "pk.eyJ1IjoidGltbXlsaW4iLCJhIjoiY20xcnBrcWR4MGRrMjJtcHpzM254OXVvbyJ9.8w1fGABq-M3ZaQnrKCSJxA";
        mapboxgl.accessToken = token;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            center: data?.[0]?.LocationJson?.coordinates || [0, 0],
            zoom: 15,
        });

        if (data != undefined) {
            for (const restaurant of data) {
                const element = document.createElement("div");
                const root = createRoot(element);
                root.render(
                    <div
                        className="flex flex-col items-center group cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();

                            const container = document.getElementById("restaurant-list-container");
                            const card = document.getElementById(`restaurant-${restaurant.ID}`);

                            if (container && card) {
                                container.scrollTo({
                                    top: card.offsetTop,
                                    behavior: "smooth"
                                });
                            }

                        }}
                    >

                        <div className="relative p-2 bg-primary text-white rounded-full border-2 border-white shadow-md z-10">
                            <Badge variant="secondary" className="absolute -top-2 -right-4 text-[10px] px-1 h-4">
                                {restaurant.Rating}
                            </Badge>
                            <Utensils size={16} />
                        </div>

                        <div className="mt-1 text-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-white/50">
                            <p className="text-xs font-bold text-neutral-950 whitespace-nowrap leading-none">
                                {restaurant.Name}
                            </p>
                            <p className="text-xs text-neutral-600 whitespace-nowrap leading-tight mt-0.5">
                                {getRestaurantsTypesString(restaurant.Types)}
                            </p>
                        </div>
                    </div>
                )
                new mapboxgl.Marker({ element: element })
                    .setLngLat(restaurant.LocationJson.coordinates)
                    .addTo(mapRef.current!);
            }
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, [data]);

    return (
        <section className="h-[50vh] relative w-full shrink-0">
            <div className="h-full w-full" ref={mapContainerRef} />
            <Button variant="outline" size="icon-lg" rounded="full" className="absolute top-2 right-2 z-10" onClick={handleCloseMap}>
                <X />
                <span className="sr-only">Close map</span>
            </Button>
        </section>
    );
};
