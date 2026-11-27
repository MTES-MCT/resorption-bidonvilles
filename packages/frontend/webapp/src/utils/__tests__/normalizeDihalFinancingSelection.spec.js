import { describe, it, expect } from "vitest";
import normalizeDihalFinancingSelection from "@/utils/normalizeDihalFinancingSelection";

describe("normalizeDihalFinancingSelection()", () => {
    it("ajouter « all » à des années ne garde que « all »", () => {
        expect(
            normalizeDihalFinancingSelection(
                ["2025", "2024"],
                ["2025", "2024", "all"]
            )
        ).toEqual(["all"]);
    });

    it('ajouter une année à ["all"] retire « all »', () => {
        expect(
            normalizeDihalFinancingSelection(["all"], ["all", "2025"])
        ).toEqual(["2025"]);
    });

    it('ajouter plusieurs années à ["all"] retire « all » et garde les années', () => {
        expect(
            normalizeDihalFinancingSelection(["all"], ["all", "2025", "2024"])
        ).toEqual(["2025", "2024"]);
    });

    it("retirer une année ne change rien d'autre", () => {
        expect(
            normalizeDihalFinancingSelection(["2025", "2024"], ["2024"])
        ).toEqual(["2024"]);
    });

    it("retirer « all » donne une sélection vide", () => {
        expect(normalizeDihalFinancingSelection(["all"], [])).toEqual([]);
    });

    it("accepte une sélection vide en entrée et en sortie", () => {
        expect(normalizeDihalFinancingSelection([], [])).toEqual([]);
        expect(normalizeDihalFinancingSelection(["2025"], [])).toEqual([]);
    });

    it("gère les entrées undefined ou null", () => {
        expect(normalizeDihalFinancingSelection(undefined, ["all"])).toEqual([
            "all",
        ]);
        expect(normalizeDihalFinancingSelection(null, ["2025"])).toEqual([
            "2025",
        ]);
        expect(normalizeDihalFinancingSelection(["2025"], undefined)).toEqual(
            []
        );
        expect(normalizeDihalFinancingSelection(["all"], null)).toEqual([]);
        expect(normalizeDihalFinancingSelection(undefined, null)).toEqual([]);
    });

    it("conserve l'ordre des années", () => {
        expect(
            normalizeDihalFinancingSelection(
                ["2023", "all"],
                ["2023", "all", "2025", "2024"]
            )
        ).toEqual(["2023", "2025", "2024"]);
    });

    it("ne mute pas ses entrées et renvoie un nouveau tableau", () => {
        const previous = ["2025"];
        const next = ["2025", "all"];
        const result = normalizeDihalFinancingSelection(previous, next);

        expect(previous).toEqual(["2025"]);
        expect(next).toEqual(["2025", "all"]);
        expect(result).not.toBe(next);

        const unchanged = ["2025"];
        expect(normalizeDihalFinancingSelection(["2025"], unchanged)).not.toBe(
            unchanged
        );
    });
});
