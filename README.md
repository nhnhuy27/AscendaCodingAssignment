# AscendaCodingAssignment
Coding assignment for Ascenda Software Engineer - Winter Internship

## Overview
This CLI application aggregates, cleans, and merges hotel data from multiple suppliers into a unified dataset. It filters results based on `hotel_ids` and `destination_ids`, providing sanitized, merged hotel data in JSON format.

## Implemented features
- Fetches raw hotel data from multiple suppliers.
- Cleans and merges data to create the best dataset.
- Filters results using `hotel_ids` and `destination_ids`.
- Outputs clean JSON data.
- Includes a `runner` script to run the program.

## Usage
### Prerequisites
- Node.js is installed.

### Installation
Clone the repository:
```bash
   git clone https://github.com/nhnhuy27/AscendaCodingAssignment.git
   cd AscendaCodingAssignment

```
### Running the CLI
Execute the `runner` script with arguments for `hotel_ids` and `destination_ids`:
```bash
./runner <hotel_ids> <destination_ids>
```
Examples:
- Filter by hotel IDs:
    ```bash
    ./runner hotel_id_1,hotel_id_2 none
    ```
- Filter by destination IDs:
    ```bash
    ./runner none destination_id_1,destination_id_2
    ```
- Return all hotels:
    ```
    ./runner none none
    ```

## Implementation details
1. Normalization rules:
- **Hotel names, addresses, cities, countries, and image descriptions:** Remove special characters and capitalize the first character of each word.
- **Descriptions and booking conditions:** Remove special characters (excluding spaces, punctuation, and some special characters like `/`).
- **Amenities:** Remove special characters (excluding spaces) and convert to lowercase. Amenities are then categorized based on a list of keywords if not yet.
- **Empty fields/subfields:** Convert to `''` if it is a string or `0` if it is a number.

2. Selection rules:
- **Hotel names, addresses, cities, and countries:** Prioritize based on number of occurrence, then length (longer is better).
- **Descriptions:** Prioritize based on number of provided amenities mentioned, then length (shorter is better).
- **Amenities:** Remove duplicates in each category.
- **Images**: Remove duplicates with both matching links and descriptions. The image is not removed if its link or description is unique in their category.
- **Booking conditions**: Remove duplicates.

#### Implementation strengths
- Simple but quite effective data sanitizing, merging, and selection rules.
- The code is scalable for future suppliers or data structure modifications.
#### Implementation limitations and improvements
- Some rules can not be effective enough to return the best data (E.g., Rules for booking condition have yet to split mismatched conditions, and have yet to filter out conditions with the same ideas behind them).
- Some parts of the code is not yet scalable.