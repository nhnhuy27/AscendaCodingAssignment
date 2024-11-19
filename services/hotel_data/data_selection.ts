import {
    amenityKeywords,
    vagueAmenityKeywords,
} from '../../constants/amenity_keywords';
import {
    Amenities,
    Hotel,
    Image,
    Images,
    Location,
} from '../../models/interfaces/hotel';
import {
    removeSpecialChars,
    removeSpecialCharsAndToLower,
    separateCamelCase,
} from '../utils/data_normalization';
import { selectMostOccurrence } from '../utils/data_selection';

//** fUNCTIONS TO SELECT THE BEST HOTEL DATA */
// Function to select the best data for each hotel
export function selectBestHotelData(mergedHotels: any[]): Hotel[] {
    let hotelsAfterSelection: Hotel[] = [];

    mergedHotels.forEach((hotel) => {
        const selectedHotel: Hotel = {
            id: hotel.id,
            destination_id: hotel.destination_id,
            name: selectMostOccurrence(hotel.name) as string, // Select the most common and longest name.
            location: selectBestLocation(hotel.location),
            description: selectBestDescription(
                hotel.description,
                filterAmenities(hotel.amenities.flat())
            ),
            amenities: filterAmenities(hotel.amenities.flat()),
            images: filterImages({
                rooms: hotel.images.rooms.flat(),
                site: hotel.images.site.flat(),
                amenities: hotel.images.amenities.flat(),
            }),
            booking_conditions: filterBookingRequirements(
                hotel.booking_conditions.flat()
            ),
        };

        hotelsAfterSelection.push(selectedHotel);
    });

    return hotelsAfterSelection;
}

// Function to select the most common latitude and longitude pair
// If there is a tie, select the first most common pair
export function selectBestLatAndLng(latsAndLngs: {
    lat: number,
    lng: number
}[]): { lat: number, lng: number } {
    const count = new Map<string, number>();
    let maxCount = 0;

    let bestLat = 0;
    let bestLng = 0;

    latsAndLngs.forEach((latAndLng) => {
        const key = `${latAndLng.lat}-${latAndLng.lng}`;
        count.set(key, (count.get(key) || 0) + 1);

        if (count.get(key)! > maxCount) {
            maxCount = count.get(key)!;
            bestLat = latAndLng.lat;
            bestLng = latAndLng.lng;
        }
    });

    return { lat: bestLat, lng: bestLng };
}

// Function to select best hotel location
// Select the most common latitude, longitude, address, city, and country
export function selectBestLocation(location: any): Location {
    const bestLocation: Location = {
        lat: 0,
        lng: 0,
        address: '',
        city: '',
        country: '',
    };

    // Full country names are preferred
    // filter out country codes
    const countryNames = location.country.filter(
        (country: string) => country.length > 2
    );

    // Select the most common value for each location field
    const bestLatAndLng = selectBestLatAndLng(location.latsAndLngs);

    bestLocation.lat = bestLatAndLng.lat;
    bestLocation.lng = bestLatAndLng.lng;
    bestLocation.address = selectMostOccurrence(location.address) as string;
    bestLocation.city = selectMostOccurrence(location.city) as string;
    bestLocation.country = countryNames.length
        ? (selectMostOccurrence(countryNames) as string)
        : (selectMostOccurrence(location.country) as string);

    return bestLocation;
}

// Function to select the best description based on the amenities provided for the hotel
// If there is a tie in the number of matching amenities, prefer the shorter description
// Users will be more likely to read a shorter description
export function selectBestDescription(
    descriptions: string[],
    amenities: Amenities
): string {
    // Flatten and normalize the amenities list (combine general and room amenities)
    let flattenAmenities =
        filterAmenities(
            (amenities.general || []).concat(amenities.room || [])
        ).general?.flat() || [];
    flattenAmenities = flattenAmenities.map((amenity) =>
        removeSpecialCharsAndToLower(amenity)
    );

    let maxMatch = 0;
    // Filter out empty descriptions
    const nonEmptyDescriptions = descriptions.filter(
        (description) => description.trim().length > 0
    );

    // Select the shortest description as the default
    let bestDescription = nonEmptyDescriptions.reduce((a, b) =>
        a.length <= b.length ? a : b
    );

    descriptions.forEach((description) => {
        if (!description) return;

        // Normalize the description to compare with amenities
        const normalizedDescription = removeSpecialCharsAndToLower(description);

        // Count how many amenities are included in the description
        const matchingAmenitiesCount = flattenAmenities.reduce(
            (count, amenity) => {
                return normalizedDescription.includes(amenity)
                    ? count + 1
                    : count;
            },
            0
        );

        // If the current description has more matching amenities, select it
        if (matchingAmenitiesCount > maxMatch) {
            maxMatch = matchingAmenitiesCount;
            bestDescription = description;
        } else if (matchingAmenitiesCount === maxMatch) {
            // In case of a tie, prefer the shorter description
            if (description.length < bestDescription.length) {
                bestDescription = description;
            }
        }
    });

    return bestDescription;
}

// Function to categorize amenities based on the keywords
export function categorizeAmenities(amenitiesArray: string[]): Amenities {
    const categorizedAmenities: { [key: string]: string[] } = {};

    amenitiesArray.forEach((amenity) => {
        // Normalize the amenity by removing special characters (spaces included) and converting to lowercase
        const normalizedAmenity = removeSpecialCharsAndToLower(amenity);

        // Iterate over the keys in amenityKeywords to categorize the amenity
        let categorized = false;
        for (const category in amenityKeywords) {
            const keywords = amenityKeywords[category];
            const match = keywords.find((keyword) =>
                normalizedAmenity.includes(keyword)
            );
            if (match) {
                if (!categorizedAmenities[category]) {
                    categorizedAmenities[category] = [];
                }
                categorizedAmenities[category].push(
                    separateCamelCase(amenity).trim()
                );
                categorized = true;
                break;
            }
        }

        // If the amenity does not match any keyword, add it to general amenities
        if (!categorized) {
            if (!categorizedAmenities.general) {
                categorizedAmenities.general = [];
            }
            categorizedAmenities.general.push(
                separateCamelCase(amenity).trim()
            );
        }
    });

    return {
        general: categorizedAmenities.general || [],
        room: categorizedAmenities.room || [],
        // Add other categories as needed
    };
}

// Function to filter out duplicate amenities and vague amenities if more specific keywords are found
export function filterAmenities(amenities: string[]): Amenities {
    // Categories the amenities before filtering
    const categorizedAmenities: Amenities = categorizeAmenities(amenities);
    const filteredAmenities: Amenities = {};

    for (const category in categorizedAmenities) {
        if (categorizedAmenities[category]) {
            // Create a map to store the original amenity values
            const originalToNormalized: Map<string, string> = new Map();

            // Normalize the amenities while keeping track of the original values
            categorizedAmenities[category].forEach((amenity) => {
                const normalized = removeSpecialCharsAndToLower(amenity);
                originalToNormalized.set(normalized, amenity);
            });

            // Get the list of normalized amenities
            const normalizedAmenities = Array.from(originalToNormalized.keys());

            // Check if any specific amenity is found in the category
            const specificFound = normalizedAmenities.some(
                (amenity) => !vagueAmenityKeywords.includes(amenity)
            );

            // Filter out vague amenities if specific ones exist
            const filteredNormalized = Array.from(
                new Set(
                    normalizedAmenities.filter((amenity) =>
                        specificFound
                            ? !vagueAmenityKeywords.includes(amenity)
                            : true
                    )
                )
            );

            // Map back to the original values
            filteredAmenities[category] = filteredNormalized.map(
                (normalized) => originalToNormalized.get(normalized)!
            );
        }
    }

    // Normalize the filtered amenities again,
    // but by turning concatenated camel case words into separate lowercase words
    // and order them alphabetically
    for (const category in filteredAmenities) {
        filteredAmenities[category] = filteredAmenities[category]
            ?.map((amenity) => separateCamelCase(amenity).trim())
            .sort();
    }

    return filteredAmenities;
}

// Function to filter out duplicate images based on the link and description
export function filterImages(images: Images): Images {
    const filteredImages: Images = {};

    // Filter out duplicate images in each category
    for (const category in images) {
        if (images[category]) {
            const filtered: Image[] = [];
            const uniqueImages = new Set<string>();

            images[category].forEach((image) => {
                const key = `${image.link}-${image.description}`;
                if (!uniqueImages.has(key)) {
                    uniqueImages.add(key);
                    filtered.push(image);
                }
            });

            filteredImages[category] = filtered;
        }
    }

    // Sort the images by alphabetical order of the description
    for (const category in filteredImages) {
        filteredImages[category] = filteredImages[category]?.sort((a, b) =>
            a.description.localeCompare(b.description)
        );
    }

    return filteredImages;
}

// Function to filter out duplicate booking requirements
//
export function filterBookingRequirements(
    bookingRequirements: string[]
): string[] {
    const normalizedConditions = new Set<string>();
    const originalConditions = [];

    for (const condition of bookingRequirements) {
        // Normalize the condition by removing special characters and spaces, and converting to lowercase
        const normalized = removeSpecialCharsAndToLower(condition);
        if (!normalizedConditions.has(normalized)) {
            normalizedConditions.add(normalized);
            originalConditions.push(condition); // Add the original condition
        }
    }

    // Normalizing the conditions again but by removing only the special characters (excluding spaces and punctuation)
    originalConditions.forEach((condition, index) => {
        originalConditions[index] = removeSpecialChars(condition);
    });
    return originalConditions;
}
