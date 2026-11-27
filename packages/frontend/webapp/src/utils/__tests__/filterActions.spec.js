import { describe, it, expect } from "vitest";
import filterActions from "@/utils/filterActions";

function buildAction(overrides = {}) {
    return {
        name: "Action",
        operators: [],
        managers: [],
        location: { region: { code: "11" } },
        ended_at: null,
        ...overrides,
    };
}

function names(actions) {
    return actions.map(({ name }) => name);
}

describe("filterActions() - recherche libre", () => {
    const actions = [
        buildAction({ name: "Maraudes (Paris)" }),
        buildAction({ name: "Accès [santé]" }),
        buildAction({ name: "a.b" }),
        buildAction({ name: "axb" }),
        buildAction({ name: "Projet c++" }),
        buildAction({ name: "Projet c" }),
    ];

    it("ne lève pas d'exception avec une parenthèse", () => {
        expect(() => filterActions(actions, { search: "(" })).not.toThrow();
        expect(names(filterActions(actions, { search: "(" }))).toEqual([
            "Maraudes (Paris)",
        ]);
    });

    it("ne lève pas d'exception avec un crochet", () => {
        expect(() => filterActions(actions, { search: "[" })).not.toThrow();
        expect(names(filterActions(actions, { search: "[" }))).toEqual([
            "Accès [santé]",
        ]);
    });

    it("traite le point littéralement (a.b ne correspond pas à axb)", () => {
        expect(names(filterActions(actions, { search: "a.b" }))).toEqual([
            "a.b",
        ]);
    });

    it("traite c++ littéralement", () => {
        expect(names(filterActions(actions, { search: "c++" }))).toEqual([
            "Projet c++",
        ]);
    });

    it("échappe les autres caractères spéciaux", () => {
        ["\\", "*", "?", "^", "$", "|", "{", ")", "]"].forEach((search) => {
            expect(() => filterActions(actions, { search })).not.toThrow();
        });
    });

    it("est insensible à la casse", () => {
        expect(names(filterActions(actions, { search: "MARAUDES" }))).toEqual([
            "Maraudes (Paris)",
        ]);
    });

    it("renvoie des résultats stables lors d'appels répétés", () => {
        const filters = { search: "projet" };
        expect(names(filterActions(actions, filters))).toEqual(
            names(filterActions(actions, filters))
        );
        expect(filterActions(actions, filters)).toHaveLength(2);
    });

    it("cherche dans le nom, les opérateurs et les gestionnaires", () => {
        const list = [
            buildAction({ name: "Alpha" }),
            buildAction({
                name: "Bravo",
                operators: [{ name: "Croix Rouge", abbreviation: "CRF" }],
            }),
            buildAction({
                name: "Charlie",
                managers: [{ name: "Préfecture", abbreviation: "PREF" }],
            }),
            buildAction({
                name: "Delta",
                operators: [{ name: "Autre", abbreviation: null }],
            }),
        ];

        expect(names(filterActions(list, { search: "alpha" }))).toEqual([
            "Alpha",
        ]);
        expect(names(filterActions(list, { search: "croix" }))).toEqual([
            "Bravo",
        ]);
        expect(names(filterActions(list, { search: "crf" }))).toEqual([
            "Bravo",
        ]);
        expect(names(filterActions(list, { search: "préfecture" }))).toEqual([
            "Charlie",
        ]);
        expect(names(filterActions(list, { search: "pref" }))).toEqual([
            "Charlie",
        ]);
        expect(filterActions(list, { search: "introuvable" })).toEqual([]);
    });

    it("ignore la recherche quand une localisation est active", () => {
        const list = [buildAction({ name: "Alpha" })];
        const result = filterActions(list, {
            search: "zzz",
            location: { typeUid: "metropole" },
        });
        expect(names(result)).toEqual(["Alpha"]);
    });
});
