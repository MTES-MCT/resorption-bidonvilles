export const isDeepEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        const sortedA = [...a].sort();
        const sortedB = [...b].sort();

        for (let i = 0; i < sortedA.length; i++) {
            if (!isDeepEqual(sortedA[i], sortedB[i])) {
                return false;
            }
        }

        return true;
    }

    if (a === b) {
        return true;
    }

    if (
        typeof a !== "object" ||
        a === null ||
        typeof b !== "object" ||
        b === null
    ) {
        return false;
    }

    let keysA = Object.keys(a),
        keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
        return false;
    }

    for (let key of keysA) {
        if (!keysB.includes(key) || !isDeepEqual(a[key], b[key])) {
            return false;
        }
    }

    return true;
};
