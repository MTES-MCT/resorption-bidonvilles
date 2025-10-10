export default function isShantytownResorbed(shantytown) {
    return shantytown.closedAt && shantytown.closedWithSolutions === "yes";
}
