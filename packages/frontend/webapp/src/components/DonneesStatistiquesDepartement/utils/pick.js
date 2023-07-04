import columns from "../columns";

export default function (uids) {
    return uids.map((uid) => {
        return {
            uid,
            ...columns[uid],
        };
    });
}
