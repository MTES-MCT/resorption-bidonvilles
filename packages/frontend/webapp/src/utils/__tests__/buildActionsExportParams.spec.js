import { describe, it, expect } from "vitest";
import buildActionsExportParams from "@/utils/buildActionsExportParams";

describe("buildActionsExportParams()", () => {
    it("n'envoie que le statut quand aucun autre filtre n'est actif", () => {
        expect(
            buildActionsExportParams({
                status: "open",
                search: "",
                location: null,
                properties: { topic: [], dihalFinancing: [] },
            })
        ).toEqual({ status: "open" });
    });

    it("transmet l'onglet des actions terminées", () => {
        expect(buildActionsExportParams({ status: "closed" })).toEqual({
            status: "closed",
        });
    });

    describe("onglet myOrganization", () => {
        it("force le statut open et transmet la structure de l'utilisateur", () => {
            expect(
                buildActionsExportParams({
                    status: "myOrganization",
                    userOrganizationId: 12,
                })
            ).toEqual({ status: "open", organizationId: 12 });
        });

        it("renvoie null pour un utilisateur sans structure (export impossible)", () => {
            [undefined, null, ""].forEach((userOrganizationId) => {
                expect(
                    buildActionsExportParams({
                        status: "myOrganization",
                        userOrganizationId,
                    })
                ).toBeNull();
            });
        });

        it("renvoie null même avec d'autres filtres actifs", () => {
            expect(
                buildActionsExportParams({
                    status: "myOrganization",
                    search: "abri",
                    properties: { topic: ["health"] },
                })
            ).toBeNull();
        });

        it("ne renvoie pas null sur les autres onglets sans structure", () => {
            expect(buildActionsExportParams({ status: "open" })).toEqual({
                status: "open",
            });
        });

        it("n'envoie pas organizationId sur les autres onglets", () => {
            const params = buildActionsExportParams({
                status: "open",
                userOrganizationId: 12,
            });
            expect(params).not.toHaveProperty("organizationId");
        });
    });

    describe("localisation", () => {
        it("transmet une localisation géographique", () => {
            expect(
                buildActionsExportParams({
                    status: "open",
                    location: {
                        code: "75",
                        departement: "75",
                        typeUid: "departement",
                        typeName: "-",
                    },
                })
            ).toEqual({
                status: "open",
                locationType: "departement",
                locationTypeUid: "departement",
                locationCode: "75",
            });
        });

        it("convertit le code en chaîne", () => {
            const params = buildActionsExportParams({
                status: "open",
                location: { code: 11, typeUid: "region" },
            });
            expect(params.locationCode).toBe("11");
        });

        it("n'envoie pas de code pour metropole / outremer", () => {
            const params = buildActionsExportParams({
                status: "open",
                location: { typeUid: "metropole" },
            });
            expect(params).toEqual({
                status: "open",
                locationType: "metropole",
                locationTypeUid: "metropole",
            });
        });

        it("transmet une localisation de type structure", () => {
            expect(
                buildActionsExportParams({
                    status: "closed",
                    location: {
                        type: "organization",
                        organizationId: 7,
                        organizationName: "Une structure",
                    },
                })
            ).toEqual({
                status: "closed",
                locationType: "organization",
                locationTypeUid: "organization",
                locationOrganizationId: 7,
            });
        });
    });

    describe("recherche", () => {
        it("transmet la recherche libre sans localisation", () => {
            expect(
                buildActionsExportParams({ status: "open", search: "abri" })
            ).toEqual({ status: "open", search: "abri" });
        });

        it("ignore la recherche quand une localisation est active (comme la liste)", () => {
            const params = buildActionsExportParams({
                status: "open",
                search: "Paris",
                location: { code: "75", typeUid: "departement" },
            });
            expect(params).not.toHaveProperty("search");
        });
    });

    describe("filtres de propriétés", () => {
        it("transmet les tableaux de valeurs", () => {
            expect(
                buildActionsExportParams({
                    status: "open",
                    properties: {
                        topic: ["health", "school"],
                        interventionLocation: ["eti"],
                        dihalFinancing: ["all"],
                    },
                })
            ).toEqual({
                status: "open",
                topic: ["health", "school"],
                interventionLocation: ["eti"],
                dihalFinancing: ["all"],
            });
        });

        it("convertit les années de financement en chaînes", () => {
            const params = buildActionsExportParams({
                status: "open",
                properties: { dihalFinancing: [2024, "2025"] },
            });
            expect(params.dihalFinancing).toEqual(["2024", "2025"]);
        });

        it("accepte une valeur unique", () => {
            const params = buildActionsExportParams({
                status: "open",
                properties: { topic: "health" },
            });
            expect(params.topic).toEqual(["health"]);
        });

        it("ignore les propriétés inconnues", () => {
            const params = buildActionsExportParams({
                status: "open",
                properties: { foo: ["bar"] },
            });
            expect(params).toEqual({ status: "open" });
        });
    });

    it("ignore les valeurs vides", () => {
        expect(
            buildActionsExportParams({
                status: "open",
                search: "",
                location: null,
                properties: {
                    topic: ["", null, undefined],
                    interventionLocation: [],
                    dihalFinancing: undefined,
                },
            })
        ).toEqual({ status: "open" });
    });

    it("combine tous les filtres actifs", () => {
        expect(
            buildActionsExportParams({
                status: "myOrganization",
                location: { code: "11", typeUid: "region" },
                properties: { topic: ["health"], dihalFinancing: ["2025"] },
                userOrganizationId: 3,
            })
        ).toEqual({
            status: "open",
            organizationId: 3,
            locationType: "region",
            locationTypeUid: "region",
            locationCode: "11",
            topic: ["health"],
            dihalFinancing: ["2025"],
        });
    });
});
