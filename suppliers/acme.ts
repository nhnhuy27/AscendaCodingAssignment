import { Supplier } from '../models/classes/supplier';
import { Hotel, Image, Images } from '../models/interfaces/hotel';
import {
    parseName,
    removeSpecialChars,
} from '../services/utils/data_normalization';

export class AcmeSupplier extends Supplier {
    name: string = 'Acme';
    endpoint: string =
        'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme';

    //! This supplier currently does not provide images
    mapImages(images: any): Image[] {
        return [];
    }
    parseImages(images: any): Images {
        return {};
    }

    parseData(data: any): Hotel[] {
        return data.map((hotel: any): Hotel => {
            const id = hotel.Id;
            const destination_id = hotel.DestinationId;
            const name = hotel.Name ? parseName(hotel.Name) : '';
            const location = {
                lat: hotel.Latitude ?? 0,
                lng: hotel.Longitude ?? 0,
                address: hotel.Address ? parseName(hotel.Address) : '',
                city: hotel.City ? parseName(hotel.City) : '',

                // From the returned data, this supplier appears to currently provides country codes.
                // I will parse it anyway.
                // Country codes would most likely not be selected in the final data selection
                //  if the country name is also provided
                country: hotel.Country ? parseName(hotel.Country) : '',
            };
            const description = hotel.Description
                ? removeSpecialChars(hotel.Description)
                : '';
            const amenities = hotel.Facilities
                ? {
                      general: hotel.Facilities ?? [],
                      room: [],
                  }
                : { general: [], room: [] };
            const images = {};
            //! This supplier currently does not provide booking conditions
            //const booking_conditions = hotel.BookingConditions ? hotel.BookingConditions : [];

            return {
                id,
                destination_id,
                name,
                location,
                description,
                amenities,
                images,
                //booking_conditions,
            };
        });
    }
}
