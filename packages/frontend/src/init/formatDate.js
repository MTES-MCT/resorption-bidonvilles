const DAYS = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
];

const MONTHS = [
    { long: "Janvier", short: "jan." },
    { long: "Février", short: "fév." },
    { long: "Mars", short: "mars" },
    { long: "Avril", short: "avr." },
    { long: "Mai", short: "mai" },
    { long: "Juin", short: "juin" },
    { long: "Juillet", short: "juil." },
    { long: "Août", short: "août" },
    { long: "Septembre", short: "sep." },
    { long: "Octobre", short: "oct." },
    { long: "Novembre", short: "nov." },
    { long: "Décembre", short: "déc." }
];

window.App = Object.freeze({
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    dateDiff(t1, t2) {
        const d1 = new Date(t1);
        const d2 = new Date(t2);

        let months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth();
        months = months <= 0 ? 0 : months;

        if (months === 0) {
            const days =
                Math.abs(d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
            return `${days} jour${days > 1 ? "s" : ""}`;
        }

        if (months < 12) {
            return `${months} mois`;
        }
        if (months === 12) {
            return "1 an";
        }

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let str = `${years} an${years > 1 ? "s" : ""}`;
        if (remainingMonths > 0) {
            str += ` ${remainingMonths} mois`;
        }

        return str;
    },

    formatDate(timestamp, format = "d/m/y") {
        const date = new Date(timestamp * 1000);
        return format
            .replace("d", `0${date.getDate()}`.slice(-2))
            .replace("m", `0${date.getMonth() + 1}`.slice(-2))
            .replace("y", date.getFullYear())
            .replace("h", `0${date.getHours()}`.slice(-2))
            .replace("i", `0${date.getMinutes()}`.slice(-2))
            .replace("M", MONTHS[date.getMonth()].long)
            .replace("B", MONTHS[date.getMonth()].short)
            .replace("U", DAYS[date.getDay()]);
    }
});
