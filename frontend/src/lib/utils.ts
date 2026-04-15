import { purifyRestaurantTypes } from "@/routes";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getPaginationList(currentPage: number, totalPages: number): number[] {
    const pages: number[] = [1];

    if (currentPage > 3) {
        pages.push(-1);
        pages.push(currentPage - 1);
        pages.push(currentPage);
    } else {
        for (let i = 2; i <= currentPage; i++) {
            pages.push(i);
        }
    }

    if (currentPage < totalPages) {
        pages.push(currentPage + 1);
    }

    if (totalPages > currentPage + 1) {
        pages.push(-1);
    }

    return pages;
}

export function getRestaurantsTypesString(types: string[]): string {
    const purifiedTypes = purifyRestaurantTypes(types);
    return purifiedTypes.map((type) => {
        const words = type.split("_");
        return words.filter((word) => word !== "restaurant").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }).join(", ");
}