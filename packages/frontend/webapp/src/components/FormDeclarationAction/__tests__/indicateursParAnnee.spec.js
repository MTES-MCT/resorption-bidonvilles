/**
 * Issue 2781 (suite) : le formulaire valide TOUTES les années d'indicateurs mais
 * InputIndicateurs n'en affiche qu'une. Vérifie que :
 * - l'année fautive est identifiée (chemin yup "indicateurs.ANNÉE.champ") ;
 * - le message (résumé et inline) cite l'année ;
 * - deux années en erreur sur un même champ ne s'écrasent pas ;
 * - InputIndicateurs bascule sur la première année en erreur.
 */
import { describe, it, expect, vi } from "vitest";

vi.mock("@/stores/config.store", () => ({
    useConfigStore: () => ({
        config: {
            topics: [
                { uid: "school" },
                { uid: "health" },
                { uid: "work" },
                { uid: "housing" },
            ],
            departements: [],
        },
    }),
}));

// InputIndicateurs : seuls la navigation d'année et la transmission des erreurs
// nous intéressent, les composants enfants sont remplacés par des doubles.
vi.mock("@resorptionbidonvilles/ui", async () => {
    const { defineComponent, h } = await import("vue");
    return {
        Button: defineComponent({
            setup(_, { slots }) {
                return () => h("button", { type: "button" }, slots.default?.());
            },
        }),
    };
});
vi.mock("@/components/IndicateursGrid/IndicateursGrid.vue", async () => {
    const { defineComponent, h } = await import("vue");
    return {
        default: defineComponent({
            setup(_, { slots }) {
                return () => h("div", slots.default?.());
            },
        }),
    };
});
vi.mock("@/components/IndicateursTable/IndicateursRow.vue", async () => {
    const { defineComponent, h } = await import("vue");
    return {
        default: defineComponent({
            setup(_, { slots }) {
                return () => h("div", [slots.left?.(), slots.right?.()]);
            },
        }),
    };
});
vi.mock(
    "@/components/InputIndicateurs/InputIndicateursPersonnes.vue",
    async () => {
        const { defineComponent, h } = await import("vue");
        return {
            default: defineComponent({
                props: { errors: Object, data: Object },
                setup(props) {
                    return () =>
                        h(
                            "pre",
                            { "data-testid": "erreurs-inline" },
                            JSON.stringify(props.errors)
                        );
                },
            }),
        };
    }
);
vi.mock(
    "@/components/InputIndicateurs/InputIndicateursScolaires.vue",
    async () => {
        const { defineComponent, h } = await import("vue");
        return {
            default: defineComponent({
                setup() {
                    return () => h("div");
                },
            }),
        };
    }
);
vi.mock("@/components/InputIndicateurs/sections.list", () => ({
    default: [],
}));
vi.mock("@/components/InputIndicateurs/inputs.list", () => ({ default: {} }));

import { useForm } from "vee-validate";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import schemaFn from "@/components/FormDeclarationAction/FormDeclarationAction.schema";
import InputIndicateurs from "@/components/InputIndicateurs/InputIndicateurs.vue";
import {
    buildIndicateursSummary,
    collectIndicateursErrors,
    getIndicateursYearsInError,
    parseIndicateursSummaryKey,
    pickYearToDisplay,
} from "@/utils/parseIndicateursErrors";

const MESSAGE_MAX_IDENTIFIED =
    "La somme des mineurs scolarisés par niveau ne peut pas dépasser le nombre total de mineurs identifiés sur site";

// Somme des niveaux (53) > mineurs de 3 ans et plus + moins de 3 ans (45)
const fautive = () => ({
    scolaire_mineurs_moins_de_trois_ans: 20,
    scolaire_mineurs_trois_ans_et_plus: 25,
    scolaire_nombre_maternelle: 20,
    scolaire_nombre_elementaire: 20,
    scolaire_nombre_college: 13,
});

function collect(indicateurs) {
    return collectIndicateursErrors(schemaFn("edit"), {
        topics: ["school"],
        indicateurs,
    });
}

describe("Erreurs d'indicateurs localisées par année", () => {
    it("identifie l'année fautive quand une autre année (vide) est affichée", async () => {
        const errorsByYear = await collect({ 2024: fautive(), 2026: {} });

        expect(Object.keys(errorsByYear)).toEqual(["2024"]);
        expect(errorsByYear[2024].scolaire_nombre_maternelle).toBe(
            MESSAGE_MAX_IDENTIFIED
        );
        expect(getIndicateursYearsInError(errorsByYear)).toEqual([2024]);
    });

    it("cite l'année dans le résumé d'erreurs", async () => {
        const errorsByYear = await collect({ 2024: fautive(), 2026: {} });
        const summary = buildIndicateursSummary(errorsByYear);

        expect(summary).toEqual({
            "indicateurs-2024-scolaire_nombre_maternelle": `Année scolaire 2023 - 2024 : ${MESSAGE_MAX_IDENTIFIED}`,
        });
        expect(
            parseIndicateursSummaryKey(
                "indicateurs-2024-scolaire_nombre_maternelle"
            )
        ).toEqual({ year: 2024, field: "scolaire_nombre_maternelle" });
        expect(parseIndicateursSummaryKey("name")).toBeNull();
    });

    it("ne fait pas s'écraser deux années en erreur sur un même champ", async () => {
        const errorsByYear = await collect({
            2024: fautive(),
            2025: fautive(),
            2026: {},
        });

        expect(getIndicateursYearsInError(errorsByYear)).toEqual([2024, 2025]);
        expect(errorsByYear[2024].scolaire_nombre_maternelle).toBe(
            MESSAGE_MAX_IDENTIFIED
        );
        expect(errorsByYear[2025].scolaire_nombre_maternelle).toBe(
            MESSAGE_MAX_IDENTIFIED
        );

        const summary = buildIndicateursSummary(errorsByYear);
        expect(Object.keys(summary)).toEqual([
            "indicateurs-2024-scolaire_nombre_maternelle",
            "indicateurs-2025-scolaire_nombre_maternelle",
        ]);
        expect(
            summary["indicateurs-2024-scolaire_nombre_maternelle"]
        ).toContain("2023 - 2024");
        expect(
            summary["indicateurs-2025-scolaire_nombre_maternelle"]
        ).toContain("2024 - 2025");
    });

    it("retourne un objet vide quand toutes les années sont valides", async () => {
        expect(await collect({ 2024: {}, 2026: {} })).toEqual({});
    });
});

describe("pickYearToDisplay", () => {
    it("choisit la plus ancienne année en erreur", () => {
        expect(pickYearToDisplay([2024, 2025], 2026, 2023, 2026)).toBe(2024);
    });

    it("garde l'année affichée si elle est déjà en erreur", () => {
        expect(pickYearToDisplay([2024, 2026], 2026, 2023, 2026)).toBe(2026);
    });

    it("ignore les années hors plage et retourne null sans année affichable", () => {
        expect(pickYearToDisplay([2020], 2026, 2023, 2026)).toBeNull();
        expect(pickYearToDisplay([], 2026, 2023, 2026)).toBeNull();
    });
});

describe("InputIndicateurs : bascule sur l'année en erreur", () => {
    function mountInput(errorsByYear) {
        const inputRef = ref(null);
        const Wrapper = defineComponent({
            setup() {
                useForm({ initialValues: { indicateurs: {} } });
                return () =>
                    h(InputIndicateurs, {
                        ref: inputRef,
                        name: "indicateurs",
                        minYear: 2023,
                        maxYear: 2025,
                        topics: ["school"],
                        errors: errorsByYear,
                    });
            },
        });
        const wrapper = mount(Wrapper);
        return { wrapper, inputRef };
    }

    const errorsByYear = {
        2023: { nombre_menages: "Trop de ménages" },
        2024: { nombre_menages: "Autre message" },
    };

    it("bascule sur la première année en erreur et affiche son erreur citant l'année", async () => {
        const { wrapper, inputRef } = mountInput(errorsByYear);
        await nextTick();

        // Année affichée au départ : la dernière (2025), sans erreur.
        expect(wrapper.text()).toContain("Résultats pour l'année 2025");
        expect(wrapper.get("[data-testid=erreurs-inline]").text()).toBe("{}");

        const shown = await inputRef.value.showFirstYearInError([2023, 2024]);

        expect(shown).toBe(2023);
        expect(wrapper.text()).toContain("Résultats pour l'année 2023");
        expect(
            JSON.parse(wrapper.get("[data-testid=erreurs-inline]").text())
        ).toEqual({
            nombre_menages: ["Année 2023 : Trop de ménages"],
        });
    });

    it("ne change pas d'année quand aucune année en erreur n'est affichable", async () => {
        const { wrapper, inputRef } = mountInput(errorsByYear);
        await nextTick();

        const shown = await inputRef.value.showFirstYearInError([1999]);

        expect(shown).toBeNull();
        expect(wrapper.text()).toContain("Résultats pour l'année 2025");
    });
});
