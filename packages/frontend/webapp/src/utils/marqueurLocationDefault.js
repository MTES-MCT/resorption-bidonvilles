import L from "leaflet";

const styles = {
    regions: {
        radius: 20,
        classes: "w-24 h-24",
    },
    departements: {
        radius: 45,
        classes: "w-24 h-24",
    },
    cities: {
        radius: 35,
    },
};

export default (level, location) => {
    const { radius, classes } = styles[level];
    const { name, total, latitude, longitude } = location;
    const borderWidth = 3;
    const size = radius * 2;
    const iconSize = size + borderWidth * 2;

    return L.marker([latitude, longitude], {
        icon: L.divIcon({
            className: "my-marker",
            html: `<span class="opacity-75 rounded-full bg-green400 text-black flex items-center justify-center text-center border-2 border-green200 ${classes}"><div><strong>${name}</strong><br/>${total} ${
                total > 1 ? "sites" : "site"
            }</div></span>`,
            iconSize: [iconSize, iconSize],
        }),
    });
};
