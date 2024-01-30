export default function (l1, l2) {
    if (!l1 || !l2) {
        return false;
    }

    return !(
        l1.search !== l2.search ||
        l1.data?.code !== l2.data?.code ||
        l1.data?.typeUid !== l2.data?.typeUid
    );
}
