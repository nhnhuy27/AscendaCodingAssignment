export interface Location {
    lat?: number;
    lng?: number;
    address?: string;
    city?: string;
    country?: string;
}

export interface Amenities {
    general?: string[];
    room?: string[];

    // New amenities can be added
    [key: string]: string[] | undefined;
}

export interface Image {
    link: string;
    description: string;
}

export interface Images {
    rooms?: Image[];
    site?: Image[];
    amenities?: Image[];

    // New image types can be added
    [key: string]: Image[] | undefined;
}

export interface Hotel {
    id: string;
    destination_id: number;
    name: string;
    location: Location;
    description?: string;
    amenities?: Amenities;
    images?: Images;
    booking_conditions?: string[];
}
