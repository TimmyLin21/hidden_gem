import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { Restaurant } from "@/api/restaurants";
import { Button } from "../ui/Button";
import { Utensils, X } from "lucide-react";
import { createRoot } from "react-dom/client";
import { Badge } from "../ui/Badge";
import { purifyRestaurantTypes } from "@/routes";
import { cn } from "@/lib/utils";

interface MapProps {
    data: Restaurant[] | undefined;
    handleCloseMap: () => void;
    activeId?: string | null;
    hoveredId?: string | null;
    onSelect: (id: string) => void;
}

function getRestaurantsTypesString(types: string[]): string {
    const purifiedTypes = purifyRestaurantTypes(types);
    return purifiedTypes.map((type) => {
        const words = type.split("_");
        return words.filter((word) => word !== "restaurant").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }).join(", ");
}

const MarkerIcon = ({ restaurant, isHovered, isActive, onSelect }: { restaurant: Restaurant, isHovered: boolean, isActive: boolean, onSelect: (id: string) => void }) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-200",
                isHovered && "scale-105",
                isActive && "-translate-y-2 duration-200 transition-transform"
            )}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(restaurant.ID);

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

            <div
                className={cn(
                    "relative p-2 bg-secondary text-white rounded-full border-2 border-white shadow-md z-10",
                    isActive && "bg-primary",
                )}
            >
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
}

export const MapView = ({ data, handleCloseMap, activeId, hoveredId, onSelect }: MapProps) => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markerRootsRef = useRef<Map<string, any>>(new Map());

    // Effect to initialize the map and add markers
    useEffect(() => {
        if (mapRef.current || data == undefined) return;

        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        mapboxgl.accessToken = token;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            center: data[0].LocationJson.coordinates,
            zoom: 15,
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [data]);

    // // Effect to update markers when data, hoveredId, or activeId changes
    useEffect(() => {
        if (!mapRef.current || data == undefined) return;

        for (const restaurant of data) {
            if (!markerRootsRef.current.has(restaurant.ID)) {
                const element = document.createElement("div");
                const root = createRoot(element);
                markerRootsRef.current.set(restaurant.ID, root);

                new mapboxgl.Marker({ element: element })
                    .setLngLat(restaurant.LocationJson.coordinates)
                    .addTo(mapRef.current!);
            }

            const isHovered = hoveredId === restaurant.ID;
            const isActive = activeId === restaurant.ID;

            markerRootsRef.current.get(restaurant.ID).render(
                <MarkerIcon
                    restaurant={restaurant}
                    isHovered={isHovered}
                    isActive={isActive}
                    onSelect={onSelect} />
            )
        }
    }, [data, hoveredId, activeId]);

    // Effect to handle map resizing
    useEffect(() => {
        if (!mapRef.current) return;

        // Create a ResizeObserver to watch the container
        const resizeObserver = new ResizeObserver(() => {
            mapRef.current?.resize();
        });

        if (mapContainerRef.current) {
            resizeObserver.observe(mapContainerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    // Effect to fly to the active restaurant when activeId changes
    useEffect(() => {
        if (!mapRef.current || !activeId || data == undefined) return;

        const selected = data.find((restaurant) => restaurant.ID === activeId);

        if (selected) {
            mapRef.current.flyTo({
                center: selected.LocationJson.coordinates,
                zoom: 15,
                essential: true,
                duration: 1500,
            });
        }

    }, [activeId])

    return (
        <section className="h-[50vh] relative w-full shrink-0 md:h-screen md:flex-1">
            <div className="h-full w-full" ref={mapContainerRef} />
            <Button variant="outline" size="icon-lg" rounded="full" className="absolute top-2 right-2 z-10" onClick={handleCloseMap}>
                <X />
                <span className="sr-only">Close map</span>
            </Button>
        </section>
    );
};
