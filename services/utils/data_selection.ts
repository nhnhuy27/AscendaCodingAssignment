// Function to select data with most occurrences
// If multiple data have the same number of occurrences, return the one with the longest length
export function selectMostOccurrence(
    data: (string | number)[]
): string | number {
    const dataMap: { [key: string]: number } = {};

    let maxOccurrence = 0;
    let selectedData: string | number = data[0];

    // Count the occurrences of each data
    data.forEach((item) => {
        const key = item.toString();
        if (dataMap[key]) {
            dataMap[key]++;
        } else {
            dataMap[key] = 1;
        }
    });

    // Find the data with the most occurrences
    Object.keys(dataMap).forEach((key) => {
        const occurrence = dataMap[key];
        const item = isNaN(Number(key)) ? key : Number(key);

        if (occurrence > maxOccurrence) {
            maxOccurrence = occurrence;
            selectedData = item;
        } else if (occurrence === maxOccurrence) {
            // Handle tie by comparing length if both are strings, or by value if numeric
            if (
                typeof item === 'string' &&
                typeof selectedData === 'string' &&
                item.length > selectedData.length
            ) {
                selectedData = item;
            } else if (
                typeof item === 'number' &&
                typeof selectedData === 'number'
            ) {
                if (item > selectedData) selectedData = item;
            }
        }
    });

    return selectedData;
}
