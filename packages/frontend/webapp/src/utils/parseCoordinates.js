/**
 * Parse coordinates from string or array format
 * @param {string|number[]|null|undefined} coordinates - Coordinates in string "lat,lng" or array [lat, lng] format
 * @returns {number[]} Array of coordinates [lat, lng] or empty array
 */
export default function parseCoordinates(coordinates) {
    if (Array.isArray(coordinates)) {
        return coordinates;
    }
    if (typeof coordinates === "string") {
        return coordinates.split(",").map(Number);
    }
    return [];
}
