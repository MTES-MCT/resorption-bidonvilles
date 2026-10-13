/**
 * Test de non-régression (issue 2781) : les règles scolaires "min-scolarises" et
 * "max-identified-minors" n'avaient pas le préfixe "FIELD:nom|MESSAGE:texte".
 * Le watcher de values.indicateurs jetait donc leur message : aucune erreur
 * visible, bouton "Mettre à jour" sans effet apparent.
 *
 * Vérifie ici :
 * - le message préfixé des règles scolaires (schéma réel) ;
 * - le repli de parseIndicateursErrors pour les messages sans préfixe ;
 * - ErrorSummary sans message (pas de warning Vue "Expected String, got Null").
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

import { useForm, useField } from "vee-validate";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import schemaFn from "@/components/FormDeclarationAction/FormDeclarationAction.schema";
import parseIndicateursErrors, {
    FALLBACK_ERROR_KEY,
} from "@/utils/parseIndicateursErrors";
import ErrorSummary from "../../../../../ui/src/components/ErrorSummary.vue";

const YEAR = 2026;

async function validateIndicateurs(year) {
    let form;
    const Comp = defineComponent({
        setup() {
            form = useForm({
                validationSchema: schemaFn("edit"),
                initialValues: {
                    topics: ["school"],
                    indicateurs: { [YEAR]: year },
                },
            });
            useField("indicateurs");
            return () => h("div");
        },
    });
    mount(Comp);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 40));

    const result = await form.validate({ mode: "silent" });
    return result.results["indicateurs"];
}

describe("Messages préfixés des règles scolaires", () => {
    it("préfixe max-identified-minors et l'affiche sous scolaire_nombre_maternelle", async () => {
        const fieldResult = await validateIndicateurs({
            scolaire_mineurs_moins_de_trois_ans: 1,
            scolaire_mineurs_trois_ans_et_plus: 1,
            scolaire_nombre_maternelle: 5,
        });

        expect(fieldResult.valid).toBe(false);
        const parsed = parseIndicateursErrors(fieldResult.errors);
        expect(parsed.scolaire_nombre_maternelle).toBe(
            "La somme des mineurs scolarisés par niveau ne peut pas dépasser le nombre total de mineurs identifiés sur site"
        );
        expect(parsed[FALLBACK_ERROR_KEY]).toBeUndefined();
    });

    it("préfixe min-scolarises et l'affiche sous scolaire_mineur_scolarise_dans_annee", async () => {
        const invalid = await validateIndicateurs({
            scolaire_mineurs_moins_de_trois_ans: 10,
            scolaire_mineurs_trois_ans_et_plus: 10,
            scolaire_nombre_maternelle: 1,
            scolaire_mineur_scolarise_dans_annee: 3,
        });
        const parsed = parseIndicateursErrors(invalid.errors);
        expect(parsed.scolaire_mineur_scolarise_dans_annee).toBeTypeOf(
            "string"
        );
        expect(parsed[FALLBACK_ERROR_KEY]).toBeUndefined();
    });
});

describe("parseIndicateursErrors : repli", () => {
    it("décode les messages préfixés par champ", () => {
        expect(
            parseIndicateursErrors(["FIELD:nombre_menages|MESSAGE:Trop grand"])
        ).toEqual({ nombre_menages: "Trop grand" });
    });

    it("conserve les messages sans préfixe sous la clé de repli", () => {
        expect(
            parseIndicateursErrors([
                "Message sans préfixe",
                "FIELD:nombre_menages|MESSAGE:Trop grand",
                "Message sans préfixe",
            ])
        ).toEqual({
            nombre_menages: "Trop grand",
            [FALLBACK_ERROR_KEY]: "Message sans préfixe",
        });
    });

    it("ignore les entrées non textuelles et tolère l'absence de messages", () => {
        expect(parseIndicateursErrors([null, 3])).toEqual({});
        expect(parseIndicateursErrors(undefined)).toEqual({});
    });
});

describe("ErrorSummary sans message", () => {
    it("n'émet pas de warning Vue et n'affiche que le résumé", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const wrapper = mount(ErrorSummary, {
            props: { message: null, summary: { indicateurs: "Erreur X" } },
        });
        expect(warn).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain("Erreur X");
        expect(
            wrapper.find(".flex.flex-row.gap-1 > .font-normal").exists()
        ).toBe(false);
        warn.mockRestore();
    });
});
