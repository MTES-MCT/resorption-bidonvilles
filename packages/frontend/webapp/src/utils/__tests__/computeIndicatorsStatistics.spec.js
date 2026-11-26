import { describe, it, expect } from "vitest";
import computeIndicatorsStatistics from "@/utils/computeIndicatorsStatistics";

function buildAction(overrides = {}) {
    return {
        is_active_previous_year: true,
        indicators_up_to_date_90d: false,
        indicators_up_to_date_180d: false,
        hasDihalFinancing: false,
        ...overrides,
    };
}

describe("computeIndicatorsStatistics()", () => {
    it("exclut les actions inactives en N-1 du numérateur ET du dénominateur", () => {
        const stats = computeIndicatorsStatistics([
            buildAction({ indicators_up_to_date_180d: true }),
            buildAction(),
            buildAction({
                is_active_previous_year: false,
                indicators_up_to_date_180d: true,
            }),
        ]);

        expect(stats.sixMonths.total).toBe(2);
        expect(stats.sixMonths.updated).toBe(1);
        expect(stats.sixMonths.percentage).toBe(50);
    });

    it("cumule hasDihalFinancing et is_active_previous_year pour la DIHAL", () => {
        const stats = computeIndicatorsStatistics([
            buildAction({
                hasDihalFinancing: true,
                indicators_up_to_date_90d: true,
            }),
            buildAction({ hasDihalFinancing: true }),
            buildAction({
                hasDihalFinancing: true,
                is_active_previous_year: false,
                indicators_up_to_date_90d: true,
            }),
            buildAction({ indicators_up_to_date_90d: true }),
        ]);

        expect(stats.dihal.total).toBe(2);
        expect(stats.dihal.updated).toBe(1);
        expect(stats.dihal.percentage).toBe(50);
    });

    it("renvoie 0 sans division par zéro quand le dénominateur est nul", () => {
        const stats = computeIndicatorsStatistics([
            buildAction({ is_active_previous_year: false }),
        ]);

        expect(stats.sixMonths).toEqual({
            updated: 0,
            total: 0,
            percentage: 0,
        });
        expect(stats.dihal).toEqual({ updated: 0, total: 0, percentage: 0 });
        expect(computeIndicatorsStatistics([]).sixMonths.percentage).toBe(0);
    });

    it("arrondit le pourcentage à 1 décimale", () => {
        const actions = [
            buildAction({ indicators_up_to_date_180d: true }),
            buildAction(),
            buildAction(),
        ];

        // 1/3 = 33,333... -> 33.3
        expect(computeIndicatorsStatistics(actions).sixMonths.percentage).toBe(
            33.3
        );

        // 2/3 = 66,666... -> 66.7
        actions[1].indicators_up_to_date_180d = true;
        expect(computeIndicatorsStatistics(actions).sixMonths.percentage).toBe(
            66.7
        );
    });
});
