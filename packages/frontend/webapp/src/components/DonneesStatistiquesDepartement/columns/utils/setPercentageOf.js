export default function (key, summary, city) {
    summary[key.replace("number", "percentage")] =
        Math.round((summary[key] / city.towns.length) * 1000) / 10;
}
