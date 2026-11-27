import { describe, it, expect } from "vitest";
import getBadgeVariant from "@/utils/getBadgeVariant";

describe("getBadgeVariant()", () => {
    // Seuils utilisés par les appelants : [80, 60] (sites, 6 mois) et [95, 80] (population, DIHAL)
    const cases = [
        { thresholds: [80, 60], value: 100, expected: "success" },
        { thresholds: [80, 60], value: 80, expected: "success" },
        { thresholds: [80, 60], value: 79, expected: "warning" },
        { thresholds: [80, 60], value: 60, expected: "warning" },
        { thresholds: [80, 60], value: 59, expected: "error" },
        { thresholds: [80, 60], value: 0, expected: "error" },
        { thresholds: [95, 80], value: 95, expected: "success" },
        { thresholds: [95, 80], value: 94, expected: "warning" },
        { thresholds: [95, 80], value: 80, expected: "warning" },
        { thresholds: [95, 80], value: 79, expected: "error" },
    ];

    cases.forEach(({ thresholds, value, expected }) => {
        it(`seuils ${thresholds.join("/")} : ${value} => ${expected}`, () => {
            expect(
                getBadgeVariant({
                    value,
                    successThreshold: thresholds[0],
                    warningThreshold: thresholds[1],
                })
            ).toBe(expected);
        });
    });
});
