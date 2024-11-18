// Function to normalize the names of hotels, streets, cities, etc.
export function parseName(name: string): string {
    return name
        .toLowerCase()
        .trim() // Remove leading and trailing spaces
        .replace(/(?:^|\s|[-_])[a-z]/g, (match) => match.toUpperCase()); // Capitalize first letter of each word using regex
}

// Function to normalize strings by removing special characters (spaces included) and converting to lowercase
export function removeSpecialCharsAndToLower(str: string): string {
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

// Function to normalize strings by removing most special characters, 
// excluding spaces, punctuation, and some special characters, and converting to lowercase
export function removeSpecialChars(str: string): string {
    return str.replace(/[^a-zA-Z0-9\s.,!?;:()'"-/]/g, '');
}
// Function to turn concatenated camel case words into separate lowercase words
//E.g.: "businessCenter" -> "business center"
export function separateCamelCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
}
