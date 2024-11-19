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
            // Compare as strings for length
            const currentAsString = item.toString();
            const selectedAsString = selectedData.toString();

            if (currentAsString.length > selectedAsString.length) {
                selectedData = item;
            }
        }
    });

    // Convert back to number if the input was entirely numbers
    if (typeof data[0] === 'number' && typeof selectedData === 'string') {
        return Number(selectedData);
    }

    return selectedData;
}
