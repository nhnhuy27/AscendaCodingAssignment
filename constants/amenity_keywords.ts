// Amenity keywords for categorizing amenities
// The keywords are normalized to lowercase and no spaces to avoid mismatches. E.G.: "business center" and "BusinessCenter"
// More amenity types can be added as needed
export const amenityKeywords: { [key: string]: string[] } = {
    room: [
        'tv',
        'coffeemachine',
        'kettle',
        'hairdryer',
        'iron',
        'aircon',
        'bathtub',
        'tub',
        'minibar',
    ],
    general: [
        'wifi',
        'pool',
        'businesscenter',
        'parking',
        'breakfast',
        'drycleaning',
        'indoorpool',
        'outdoorpool',
        'bar',
        'childcare',
        'concierge',
    ],
};
// Vague amenity keywords that would be excluded if more specific keywords are found
export const vagueAmenityKeywords = ['pool', 'tub', 'ac', 'aircon'];
