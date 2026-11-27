import { describe, it, expect } from "vitest";
import computeCandidateYears from "@/utils/computeCandidateYears";

const NOW = new Date("2026-06-15T12:00:00Z");

function utc(date) {
    return new Date(date).getTime();
}

function action(startedAt, endedAt = null) {
    return {
        started_at: utc(startedAt),
        ended_at: endedAt === null ? null : utc(endedAt),
    };
}

describe("computeCandidateYears()", () => {
    it("renvoie [] pour une liste vide ou invalide", () => {
        expect(computeCandidateYears([], NOW)).toEqual([]);
        expect(computeCandidateYears(undefined, NOW)).toEqual([]);
        expect(computeCandidateYears(null, NOW)).toEqual([]);
    });

    it("renvoie toutes les années de 2020 à l'année de now pour une action 2020-2024", () => {
        expect(
            computeCandidateYears([action("2020-03-01", "2024-05-01")], NOW)
        ).toEqual([2020, 2021, 2022, 2023, 2024, 2025, 2026]);
    });

    it("utilise le minimum des dates de début de plusieurs actions", () => {
        const actions = [
            action("2023-01-10"),
            action("2021-09-01", "2022-01-01"),
            action("2024-01-01"),
        ];
        expect(computeCandidateYears(actions, NOW)).toEqual([
            2021, 2022, 2023, 2024, 2025, 2026,
        ]);
    });

    it("lit l'année en UTC : le 1er janvier à minuit UTC reste dans son année", () => {
        expect(computeCandidateYears([action("2025-01-01")], NOW)).toEqual([
            2025, 2026,
        ]);
        expect(computeCandidateYears([action("2024-12-31")], NOW)).toEqual([
            2024, 2025, 2026,
        ]);
    });

    it("borne haute : l'année UTC de now, y compris le 1er janvier à minuit UTC", () => {
        const newYear = new Date("2027-01-01T00:00:00Z");
        expect(computeCandidateYears([action("2026-05-01")], newYear)).toEqual([
            2026, 2027,
        ]);
        const lastSecond = new Date("2026-12-31T23:59:59Z");
        expect(
            computeCandidateYears([action("2026-05-01")], lastSecond)
        ).toEqual([2026]);
    });

    it("fonctionne avec des actions sans ended_at", () => {
        expect(
            computeCandidateYears([action("2024-02-01", null)], NOW)
        ).toEqual([2024, 2025, 2026]);
        expect(
            computeCandidateYears([{ started_at: utc("2025-02-01") }], NOW)
        ).toEqual([2025, 2026]);
    });

    it("renvoie [] si toutes les actions commencent après l'année en cours", () => {
        expect(
            computeCandidateYears(
                [action("2027-01-01"), action("2028-06-01")],
                NOW
            )
        ).toEqual([]);
    });

    it("ignore les actions futures quand une autre action a déjà commencé", () => {
        expect(
            computeCandidateYears(
                [action("2030-01-01"), action("2025-01-01")],
                NOW
            )
        ).toEqual([2025, 2026]);
    });

    it("renvoie des nombres en ordre croissant", () => {
        const years = computeCandidateYears([action("2022-01-01")], NOW);
        expect(years.every((year) => typeof year === "number")).toBe(true);
        expect(years).toEqual([...years].sort((a, b) => a - b));
    });

    it("ne modifie pas les actions fournies", () => {
        const actions = [action("2024-01-01"), action("2022-01-01")];
        const copy = JSON.parse(JSON.stringify(actions));
        computeCandidateYears(actions, NOW);
        expect(actions).toEqual(copy);
    });
});
