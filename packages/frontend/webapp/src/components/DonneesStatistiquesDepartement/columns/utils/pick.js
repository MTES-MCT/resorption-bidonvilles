import columns from "../index";

export default function (uids) {
    return uids.map((uid) => {
        return {
            uid,
            ...columns[uid],
        };
    });
}
