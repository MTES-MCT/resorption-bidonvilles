/**
 * Test de non-régression : les validations d'indicateurs conditionnées par un
 * "topic" (champ d'intervention) doivent s'exécuter CÔTÉ CLIENT (carte 2560).
 *
 * Régression historique : ces règles utilisaient `.when("$topics", ...)`, mais la
 * variable de contexte $topics n'est pas propagée par vee-validate jusqu'aux
 * champs profondément imbriqués (indicateurs -> année -> champ). Toutes les
 * validations conditionnelles (scolaire, santé, emploi, logement) étaient donc
 * silencieusement désactivées côté client : l'erreur n'était détectée que par le
 * backend (400), sans affichage inline ni autofocus, et le bouton se bloquait.
 *
 * Fix : la liste `topics` est lue depuis les valeurs racine (options.parent dans
 * le lazy) et passée explicitement à createIndicateurFields(topics).
 *
 * Le store de config est mocké car le schéma le lit (liste des topics).
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

const YEAR = 2026;

function mountWithSchema(initialValues) {
    let form;
    const Comp = defineComponent({
        setup() {
            form = useForm({
                validationSchema: schemaFn("edit"),
                initialValues,
            });
            useField("indicateurs");
            return () => h("div");
        },
    });
    mount(Comp);
    return () => form;
}

describe("Validation des indicateurs conditionnée par topic (côté client)", () => {
    it("détecte l'erreur scolaire quand le topic 'school' est sélectionné", async () => {
        const getForm = mountWithSchema({
            topics: ["school"],
            indicateurs: {
                [YEAR]: { scolaire_mineur_scolarise_dans_annee: 2 },
            },
        });
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 40));

        const result = await getForm().validate({ mode: "silent" });
        const fieldResult = result.results["indicateurs"];

        expect(fieldResult?.valid).toBe(false);
        expect(JSON.stringify(fieldResult?.errors)).toContain(
            "Mineurs identifiés sur site"
        );
    });

    it("n'applique pas la règle scolaire quand le topic 'school' n'est pas sélectionné", async () => {
        const getForm = mountWithSchema({
            topics: ["health"],
            indicateurs: {
                [YEAR]: { scolaire_mineur_scolarise_dans_annee: 2 },
            },
        });
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 40));

        const result = await getForm().validate({ mode: "silent" });
        const fieldResult = result.results["indicateurs"];

        expect(JSON.stringify(fieldResult?.errors || [])).not.toContain(
            "Mineurs identifiés sur site"
        );
    });
});
