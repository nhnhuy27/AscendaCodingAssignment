import { Hotel } from '../../models/interfaces/hotel';

// Function to find hotel data based on hotelIds and destinationIds
//* The function only returns the hotel data that matches both the hotel_id and destination_id
//* If no hotelIds are provided, return the hotels that match the destinationIds
//* If no destinationIds are provided, return the hotels that match the hotelIds
//* If both hotelIds and destinationIds are provided, return the hotels that match both
//* If no hotelIds or destinationIds are provided, return all hotels
export function findHotelData(
    hotelData: Hotel[],
    hotelIds: string[] = [],
    destinationIds: string[] = []
): Hotel[] {
    // If no hotel_id or destination_id is provided in the input, return all hotels
    if (!hotelIds.length && !destinationIds.length) return hotelData;

    return hotelData.filter((hotel) => {
        return (
            (!hotelIds.length || hotelIds.includes(hotel.id)) &&
            (!destinationIds.length ||
                destinationIds.includes(hotel.destination_id.toString()))
        );
    });
}
