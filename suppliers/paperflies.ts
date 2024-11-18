import { Supplier } from '../models/classes/supplier';
import { Amenities, Hotel, Image, Images } from '../models/interfaces/hotel';
import {
    parseName,
    separateCamelCase,
} from '../services/utils/data_normalization';

export class PaperfliesSupplier extends Supplier {
    name: string = 'Paperflies';
    endpoint: string =
        'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies';

    mapImages(imageArray: any[]): Image[] {
        return imageArray.map((img: any) => ({
            link: img.link ?? '',
            description: img.caption ?? '',
        }));
    }
    parseImages(images: any): Images {
        return {
            rooms: images.rooms ? this.mapImages(images.rooms) : [],
            site: images.site ? this.mapImages(images.site) : [],
            //! This supplier currently does not provide amenities images
            // amenities: images.amenities ? this.mapImages(images.amenities) : [],
        };
    }

    parseData(data: any): Hotel[] {
        return data.map((hotel: any): Hotel => {
            const id = hotel.hotel_id;
            const destination_id = hotel.destination_id;
            const name = hotel.hotel_name ? parseName(hotel.hotel_name) : '';
            const location = {
                lat: 0,
                lng: 0,
                address: hotel.location.address
                    ? parseName(hotel.location.address)
                    : '',
                city: '', //! This supplier currently does not provide city field
                country: hotel.location.country
                    ? parseName(hotel.location.country)
                    : '',
            };
            const description = hotel.details;
            const amenities = hotel.amenities
                ? {
                      general: hotel.amenities.general ?? [],
                      room: hotel.amenities.room ?? [],
                  }
                : { general: [], room: [] };
            const images = hotel.images ? this.parseImages(hotel.images) : {};
            const booking_conditions = hotel.booking_conditions ?? [];

            return {
                id,
                destination_id,
                name,
                location,
                description,
                amenities,
                images,
                booking_conditions,
            };
        });
    }
}
