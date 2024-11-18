import { Amenities, Hotel, Image, Images } from '../interfaces/hotel';

export abstract class Supplier {
    abstract name?: string;
    abstract endpoint: string;


    // Each supplier will have a different image structure / naming convention
    abstract mapImages(images: any): Image[];
    abstract parseImages(images: any): Images;

    // Each supplier will have a different data structure
    abstract parseData(data: any): Hotel[];
}
