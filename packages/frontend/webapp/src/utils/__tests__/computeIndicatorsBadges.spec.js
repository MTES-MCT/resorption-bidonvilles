import { describe, it, expect } from "vitest";
import computeIndicatorsBadges from "@/utils/computeIndicatorsBadges";

function stats(sixMonthsPercentage, dihalPercentage, total = 10) {
    return {
        sixMonths: { total, updated: 0, percentage: sixMonthsPercentage },
        dihal: { total, updated: 0, percentage: dihalPercentage },
    };
}

describe("computeIndicatorsBadges()", () => {
    it("formate le libellé en pourcentage", () => {
        const badges = computeIndicatorsBadges(stats(75, 90));
        expect(badges.sixMonths.label).toBe("75%");
        expect(badges.dihal.label).toBe("90%");
    });

    it("applique les seuils 80 / 60 pour les 6 mois", () => {
        const variant = (p) =>
            computeIndicatorsBadges(stats(p, 0)).sixMonths.variant;
        expect(variant(80)).toBe("success");
        expect(variant(79)).toBe("warning");
        expect(variant(60)).toBe("warning");
        expect(variant(59)).toBe("error");
    });

    it("applique les seuils 95 / 80 pour la DIHAL", () => {
        const variant = (p) =>
            computeIndicatorsBadges(stats(0, p)).dihal.variant;
        expect(variant(95)).toBe("success");
        expect(variant(94)).toBe("warning");
        expect(variant(80)).toBe("warning");
        expect(variant(79)).toBe("error");
    });

    it("n'a pas de libellé quand aucune action n'est comptée", () => {
        const badges = computeIndicatorsBadges(stats(0, 0, 0));
        expect(badges.sixMonths.label).toBe(false);
        expect(badges.dihal.label).toBe(false);
    });
});
