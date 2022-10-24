import formatDate from "#frontend/common/helpers/formatDate";

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

    formatDate
});
