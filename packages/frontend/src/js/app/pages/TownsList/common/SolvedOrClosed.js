export function isClosed(shantytown) {
    return shantytown.closedAt && shantytown.closedWithSolutions !== "yes";
}

export function isSolved(shantytown) {
    return shantytown.closedAt && shantytown.closedWithSolutions === "yes";
}
