export type Restaurant = {
    ID: string;
    CreatedAt: string;
    UpdatedAt: string;
    PlaceID: string;
    Name: string;
    SourceUrl: string;
    Rating: number;
    PriceLevel: number;
    Address: string;
    Website: {
        String: string;
        Valid: boolean;
    };
    Telephone: {
        String: string;
        Valid: boolean;
    };
    Types: string[];
    Restroom: boolean;
    ImageUrl: {
        String: string;
        Valid: boolean;
    };
}

export const fetchRestaurants = async (rating?: number, price_level?: number, types?: string[], restroom?: boolean, query?: string): Promise<Restaurant[]> => {
    const querys = [];
    if (rating !== undefined) {
        querys.push(`rating=${rating}`);
    }
    if (price_level !== undefined) {
        querys.push(`price_level=${price_level}`);
    }
    if (types !== undefined && types.length > 0) {
        querys.push(`types=${types.join(",")}`);
    }
    if (restroom !== undefined) {
        querys.push(`restroom=${restroom}`);
    }
    if (query !== undefined) {
        querys.push(`query=${encodeURIComponent(query)}`);
    }
    const queryString = querys.length > 0 ? `?${querys.join("&")}` : "";
    const response = await fetch(`/api/restaurants${queryString}`);
    return await response.json();
}

export const fetchRestaurantTypes = async (): Promise<string[]> => {
    const response = await fetch(`/api/restaurants/types`);
    return await response.json();
}