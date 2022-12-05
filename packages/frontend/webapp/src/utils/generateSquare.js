import * as turf from "@turf/turf";

export default function generateSquare(center, radius) {
    const cross = Math.sqrt(2 * radius ** 2);
    const coordinates = [];

    for (let i = 0; i < 4; i++) {
        coordinates.push(
            turf.destination(center, cross, (i * -360) / 4 + 45, {}).geometry
                .coordinates
        );
    }
    coordinates.push(coordinates[0]);

    return turf.polygon([coordinates], {}).geometry;
}
