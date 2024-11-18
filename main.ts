import { fetchHotelData } from './services/hotel_data/data_fetching';
import { findHotelData } from './services/hotel_data/data_finding';
import { mergeHotelData } from './services/hotel_data/data_merging';
import { selectBestHotelData } from './services/hotel_data/data_selection';

async function main() {
    try {
        const [, , hotelIdsArg, destinationIdsArg] = process.argv;

        // Check if exactly 2 arguments are provided
        if (process.argv.length !== 4) {
            console.error(
                'Error: Invalid number of arguments. Expected 2 arguments: <hotel_ids> <destination_ids>'
            );
            process.exit(1); // Exit with a non-zero status to indicate an error
        }

        const hotelIds = hotelIdsArg === 'none' ? [] : hotelIdsArg.split(',');
        const destinationIds =
            destinationIdsArg === 'none' ? [] : destinationIdsArg.split(',');

        const hotelData = await fetchHotelData();
        const mergedHotelData = mergeHotelData(hotelData);
        const hotelDataAfterSelection = selectBestHotelData(mergedHotelData);
        const hotelDataResults = findHotelData(
            hotelDataAfterSelection,
            hotelIds,
            destinationIds
        );

        console.log(JSON.stringify(hotelDataResults, null, 2));
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
