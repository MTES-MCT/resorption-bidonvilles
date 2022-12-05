export default function (search, location) {
    if (location) {
        return search; // la "search" correspond systématiquement au nom de la "location" sélectionnée
    }

    if (search) {
        return `« ${search} »`;
    }

    return "France";
}
