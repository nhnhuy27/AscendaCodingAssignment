import { Supplier } from '../models/classes/supplier';
import { Hotel, Image, Images } from '../models/interfaces/hotel';
import { parseName, removeSpecialChars } from '../utils/data_normalization';

export class PatagoniaSupplier extends Supplier {
    name: string = 'Patagonia';
    endpoint: string =
        'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia';

    mapImages(imageArray: any[]): Image[] {
        return imageArray.map((img: any) => ({
            link: img.url ?? '',
            description: img.description ? parseName(img.description) : '',
        }));
    }

    parseImages(images: any): Images {
        return {
            rooms: images.rooms ? this.mapImages(images.rooms) : [],
            //! This supplier currently does not have site images
            // site: images.site ? this.mapImages(images.site) : [],
            amenities: images.amenities ? this.mapImages(images.amenities) : [],
        };
    }

    parseData(data: any): Hotel[] {
        return data.map((hotel: any): Hotel => {
            const id = hotel.id;
            const destination_id = hotel.destination;
            const name = hotel.name ? parseName(hotel.name) : '';
            const location = {
                lat: hotel.lat ?? 0,
                lng: hotel.lng ?? 0,
                address: hotel.address ? parseName(hotel.address) : '',
                //! This supplier currently does not provide city and country fields
                city: '',
                country: '',
            };
            const description = hotel.info
                ? removeSpecialChars(hotel.info)
                : '';
            const amenities = hotel.amenities
                ? {
                      general: hotel.amenities ?? [],
                      room: [],
                  }
                : { general: [], room: [] };
            const images = hotel.images ? this.parseImages(hotel.images) : {};
            //! This supplier currently does not provide booking conditions
            //const booking_conditions = hotel.booking_conditions ? hotel.booking_conditions : [];

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
