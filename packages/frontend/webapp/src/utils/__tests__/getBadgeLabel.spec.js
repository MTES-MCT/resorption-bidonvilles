import { describe, it, expect } from "vitest";
import getBadgeLabel from "@/utils/getBadgeLabel";

describe("getBadgeLabel()", () => {
    describe("appel de computeIndicatorsBadges (percentageOnly: true)", () => {
        const base = {
            positiveLabel: false,
            emptyLabel: false,
            percentageOnly: true,
        };

        it("renvoie uniquement le pourcentage si count > 0", () => {
            expect(getBadgeLabel({ ...base, count: 10, percentage: 75 })).toBe(
                "75%"
            );
        });

        it("renvoie false (emptyLabel) si count vaut 0", () => {
            expect(getBadgeLabel({ ...base, count: 0, percentage: 0 })).toBe(
                false
            );
        });
    });

    describe("appels de ListeDesSitesStatistiques (percentageOnly omis)", () => {
        const sites = {
            positiveLabel: "mis à jour dans les 6 derniers mois",
            emptyLabel: "Aucun site mis à jour au cours des 6 derniers mois",
        };
        const population = {
            positiveLabel:
                "dont le nombre d’habitants a été mis à jour dans les 3 derniers mois",
            emptyLabel:
                "Aucun site dont les habitants ont été mis à jour au cours des 3 derniers mois",
        };

        it("préfixe le pourcentage entre parenthèses (sites)", () => {
            expect(getBadgeLabel({ ...sites, count: 4, percentage: 50 })).toBe(
                "(50%) mis à jour dans les 6 derniers mois"
            );
        });

        it("renvoie le libellé vide si count vaut 0 (sites)", () => {
            expect(getBadgeLabel({ ...sites, count: 0, percentage: 0 })).toBe(
                "Aucun site mis à jour au cours des 6 derniers mois"
            );
        });

        it("préfixe le pourcentage entre parenthèses (population)", () => {
            expect(
                getBadgeLabel({ ...population, count: 2, percentage: 20 })
            ).toBe(
                "(20%) dont le nombre d’habitants a été mis à jour dans les 3 derniers mois"
            );
        });

        it("renvoie le libellé vide si count vaut 0 (population)", () => {
            expect(
                getBadgeLabel({ ...population, count: 0, percentage: 0 })
            ).toBe(
                "Aucun site dont les habitants ont été mis à jour au cours des 3 derniers mois"
            );
        });
    });

    it("traite percentageOnly omis comme faux (ancien défaut null)", () => {
        expect(
            getBadgeLabel({
                count: 1,
                percentage: 10,
                positiveLabel: "x",
                emptyLabel: "y",
            })
        ).toBe("(10%) x");
    });
});
