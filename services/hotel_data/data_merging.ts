import { hotelDataResType } from '../../models/response_types/hotel_data';

// Function to merge hotel data from all suppliers
// The function takes the return data from fetchHotelData as input
export function mergeHotelData(data: hotelDataResType[]) {
    const flattenedData = data.map((item) => item.data).flat();

    // Create a map to store all merged hotels
    // Key: hotel id and destination id
    // Value: hotel object but with fields/subfields merged into arrays from all suppliers
    const hotelMap: { [key: string]: any } = {};

    flattenedData.forEach((hotel) => {
        const key = `${hotel.id}-${hotel.destination_id}`;
        // If hotel does not exist in the map, add it into the map
        if (!hotelMap[key]) {
            hotelMap[key] = {
                ...hotel,
                name: hotel.name ? [hotel.name] : [],
                location: {
                    latsAndLngs: [
                        {
                            lat: hotel.location.lat ? hotel.location.lat : 0,
                            lng: hotel.location.lng ? hotel.location.lng : 0,
                        },
                    ],
                    address: hotel.location.address
                        ? [hotel.location.address]
                        : [],
                    city: hotel.location.city ? [hotel.location.city] : [],
                    country: hotel.location.country
                        ? [hotel.location.country]
                        : [],
                },
                description: hotel.description ? [hotel.description] : [],
                amenities: hotel.amenities ?? [],
                images: {
                    rooms: hotel.images?.rooms ? [hotel.images.rooms] : [],
                    amenities: hotel.images?.amenities
                        ? [hotel.images.amenities]
                        : [],
                    site: hotel.images?.site ? [hotel.images.site] : [],
                },
                booking_conditions: hotel.booking_conditions ?? [],
            };
        } else {
            // If hotel exists in the map, merge the fields
            const existingHotel = hotelMap[key];

            // Merge location fields
            // Add to array if the field is not null or undefined
            existingHotel.location = {
                latsAndLngs: [
                    ...existingHotel.location.latsAndLngs,
                    {
                        lat: hotel.location.lat ? hotel.location.lat : 0,
                        lng: hotel.location.lng ? hotel.location.lng : 0,
                    },
                ],
                address: [
                    ...existingHotel.location.address,
                    ...(hotel.location.address ? [hotel.location.address] : []),
                ],
                city: [
                    ...existingHotel.location.city,
                    ...(hotel.location.city ? [hotel.location.city] : []),
                ],
                country: [
                    ...existingHotel.location.country,
                    ...(hotel.location.country ? [hotel.location.country] : []),
                ],
            };

            // Merge description fields
            if (hotel.description) {
                existingHotel.description = [
                    ...existingHotel.description,
                    hotel.description,
                ];
            }

            // Merge amenities fields
            existingHotel.amenities = [
                ...Object.values(existingHotel.amenities || {}).flat(),
                ...Object.values(hotel.amenities || {}).flat(),
            ];

            // Merge images fields
            existingHotel.images = {
                rooms: [
                    ...(existingHotel.images?.rooms || []),
                    ...(hotel.images?.rooms || []),
                ],
                amenities: [
                    ...(existingHotel.images?.amenities || []),
                    ...(hotel.images?.amenities || []),
                ],
                site: [
                    ...(existingHotel.images?.site || []),
                    ...(hotel.images?.site || []),
                ],
            };

            // Merge booking conditions fields
            existingHotel.booking_conditions =
                existingHotel.booking_conditions.concat(
                    hotel.booking_conditions ?? []
                );
        }
    });

    // Return the values of the map, which are the merged hotel objects
    return Object.values(hotelMap);
}
