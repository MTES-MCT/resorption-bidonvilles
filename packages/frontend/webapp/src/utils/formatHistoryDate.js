import formatDate from "./formatDate";

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

    if (isSameDay(now, then)) {
        return "Aujourd'hui";
    } else {
        now.setDate(now.getDate() - 1);
        if (isSameDay(now, then)) {
            return "Hier";
        }
    }

    return formatDate(date, "d M y");
}
