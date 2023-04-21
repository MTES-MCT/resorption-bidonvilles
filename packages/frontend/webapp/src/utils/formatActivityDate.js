import formatDate from "../../../common/utils/formatDate";

function isSameDay(now, then) {
    return (
        now.getFullYear() === then.getFullYear() &&
        now.getMonth() === then.getMonth() &&
        now.getDate() === then.getDate()
    );
}

export default function (date) {
    const now = new Date();
    const then = new Date(date * 1000);

    let day = `${formatDate(date, "U")} ${formatDate(date, "d M y")}`;
    if (isSameDay(now, then)) {
        day = "Aujourd'hui";
    } else {
        now.setDate(now.getDate() - 1);
        if (isSameDay(now, then)) {
            day = "Hier";
        }
    }

    return `${day} à ${formatDate(date, "h")}h`;
}
