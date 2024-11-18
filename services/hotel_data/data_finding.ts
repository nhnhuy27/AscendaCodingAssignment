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
    if (!hotelIds.length && !destinationIds.length) return hotelData;

    return hotelData
        .filter((hotel) => {
            const matchesHotel = hotelIds.length
                ? hotelIds.includes(hotel.id)
                : true;
            const matchesDestination = destinationIds.length
                ? destinationIds.includes(hotel.destination_id.toString())
                : true;

            return matchesHotel && matchesDestination;
        })
        .sort((a, b) => {
            // Preserve the order of hotelIds
            if (hotelIds.length) {
                const indexA = hotelIds.indexOf(a.id);
                const indexB = hotelIds.indexOf(b.id);
                return indexA - indexB;
            }

            // Preserve the order of destinationIds
            if (destinationIds.length) {
                const indexA = destinationIds.indexOf(
                    a.destination_id.toString()
                );
                const indexB = destinationIds.indexOf(
                    b.destination_id.toString()
                );
                return indexA - indexB;
            }

            return 0;
        });
}