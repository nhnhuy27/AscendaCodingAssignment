import { DATA_SUPPLIERS } from '../../constants/data_suppliers';
import { hotelDataResType } from '../../models/response_types/hotel_data';

// Function to fetch data from all suppliers in the list
export async function fetchHotelData(): Promise<hotelDataResType[]> {
    const hotelData = await Promise.all(
        DATA_SUPPLIERS.map(async (supplier) => {
            const response = await fetch(supplier.endpoint);
            return {
                supplier: supplier.name ? supplier.name : '',
                data: supplier.parseData(await response.json()),
            };
        })
    );

    return hotelData;
}
