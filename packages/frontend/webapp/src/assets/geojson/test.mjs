import { promises as fs } from "fs";
import data from "./departements.json" assert { type: "json" };

(async () => {
    const { features } = data;
    features.forEach(async (feature) => {
        await fs.writeFile(
            `./departements/${feature.properties.code}.json`,
            JSON.stringify({
                type: "FeatureCollection",
                features: [feature],
            })
        );
    });
})();
