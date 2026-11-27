import { describe, it, expect } from "vitest";
import computeExportableYears from "@/utils/computeExportableYears";

function utc(date) {
    return new Date(date).getTime();
}

function action(startedAt, endedAt = null) {
    return {
        started_at: utc(startedAt),
        ended_at: endedAt === null ? null : utc(endedAt),
    };
}

describe("computeExportableYears()", () => {
    it("renvoie [] quand la liste d'actions est vide", () => {
        expect(computeExportableYears([], [2023, 2024])).toEqual([]);
    });

    it("renvoie [] quand aucune action n'est active sur les années", () => {
        const actions = [action("2010-03-01", "2011-06-30")];
        expect(computeExportableYears(actions, [2023, 2024])).toEqual([]);
    });

    it("renvoie [] quand il n'y a aucune année", () => {
        expect(computeExportableYears([action("2020-01-01")], [])).toEqual([]);
    });

    it("inclut l'année quand l'action débute le 31/12", () => {
        expect(
            computeExportableYears([action("2023-12-31", "2024-05-01")], [2023])
        ).toEqual([2023]);
    });

    it("inclut l'année quand l'action se termine le 01/01", () => {
        expect(
            computeExportableYears([action("2020-05-01", "2023-01-01")], [2023])
        ).toEqual([2023]);
    });

    it("exclut l'année quand l'action débute le 01/01 de l'année suivante", () => {
        expect(computeExportableYears([action("2024-01-01")], [2023])).toEqual(
            []
        );
    });

    it("exclut l'année quand l'action s'est terminée le 31/12 de l'année précédente", () => {
        expect(
            computeExportableYears([action("2020-05-01", "2022-12-31")], [2023])
        ).toEqual([]);
    });

    it("traite une action sans date de fin comme toujours en cours", () => {
        const actions = [action("2021-04-10")];
        expect(computeExportableYears(actions, [2020, 2021, 2025])).toEqual([
            2021, 2025,
        ]);
    });

    it("garde les années couvertes par au moins une action parmi plusieurs", () => {
        const actions = [
            action("2019-01-15", "2020-06-30"),
            action("2022-02-01", "2022-11-30"),
        ];
        expect(
            computeExportableYears(actions, [2019, 2020, 2021, 2022, 2023])
        ).toEqual([2019, 2020, 2022]);
    });

    it("conserve l'ordre et le type des années fournies", () => {
        const actions = [action("2020-01-01")];
        expect(computeExportableYears(actions, [2024, 2021, 2019])).toEqual([
            2024, 2021,
        ]);
    });

    it("ne modifie pas ses entrées", () => {
        const actions = [action("2020-01-01", "2021-12-31")];
        const years = [2022, 2021, 2020];
        const actionsCopy = JSON.parse(JSON.stringify(actions));
        const yearsCopy = [...years];

        computeExportableYears(actions, years);

        expect(actions).toEqual(actionsCopy);
        expect(years).toEqual(yearsCopy);
    });
});
