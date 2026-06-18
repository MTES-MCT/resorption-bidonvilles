/**
 * Test de non-régression : bouton "Mettre à jour" qui reste grisé après
 * correction d'une erreur d'indicateur scolaire (carte 2560).
 *
 * Cause réelle (confirmée par logs navigateur) : après un clic "Mettre à jour",
 * le backend rejette en 400 et renvoie ses erreurs sous des clés DÉTAILLÉES au
 * format express-validator, ex. "indicateurs[2026].scolaire_mineur_scolarise_dans_annee".
 * `setErrors(e.fields)` les pose dans errors.value de vee-validate.
 * Le deep watch de re-validation n'utilise que `validate({ mode: 'silent' })`, qui
 * met à jour result.results sous la clé HOISTÉE "indicateurs" mais ne nettoie jamais
 * les clés détaillées du backend. L'erreur restait donc collée → hasErrors restait
 * vrai → bouton grisé en permanence (et donc inopérant).
 *
 * Fix : quand les indicateurs redeviennent valides, purger toutes les clés
 * errors.value qui commencent par "indicateurs" (hoistée ET détaillées backend).
 *
 * Ce test reproduit le flux minimal (useForm + deep watch + useField imbriqué +
 * setErrors backend) sans monter tout FormDeclarationAction.vue (stores/router/API).
 */
import { describe, it, expect } from "vitest";
import { useForm, useField } from "vee-validate";
import { object, number, lazy } from "yup";
import { defineComponent, h, computed, watch, ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";

const emptyStringToNull = (value, originalValue) =>
    typeof originalValue === "string" && originalValue === "" ? null : value;
const num = () => number().nullable().transform(emptyStringToNull);

// Règle réelle (extrait de FormDeclarationAction.schema.js) :
// scolarisé-dans-l'année requiert au moins un champ "mineurs identifiés".
const yearShape = () => ({
    scolaire_mineurs_moins_de_trois_ans: num(),
    scolaire_mineur_scolarise_dans_annee: num().test(
        "requires-identified-minors",
        "FIELD:scolaire_mineur_scolarise_dans_annee|MESSAGE:requiert identifiés",
        function (value) {
            if (!Number.isInteger(value)) {
                return true;
            }
            return Number.isInteger(
                this.parent.scolaire_mineurs_moins_de_trois_ans
            );
        }
    ),
});
const schema = object({
    indicateurs: lazy((value) =>
        object()
            .shape(
                Object.keys(value || {}).reduce((acc, k) => {
                    acc[k] = object()
                        .required()
                        .shape(yearShape())
                        .label("Indicateurs " + k);
                    return acc;
                }, {})
            )
            .required()
    ),
});

const YEAR = 2026;
// Clé d'erreur telle que renvoyée par le backend (express-validator, notation crochets).
const BACKEND_ERROR_KEY = `indicateurs[${YEAR}].scolaire_mineur_scolarise_dans_annee`;

let api;
function mountForm(initialValues) {
    const globalError = ref(null);
    const { validate, values, errors, setErrors, setFieldError } = useForm({
        validationSchema: schema,
        initialValues,
    });
    const { value: indicateurs } = useField("indicateurs");
    const indicateursErrors = ref({});
    const hasErrors = computed(
        () =>
            globalError.value !== null ||
            Object.keys(errors.value).length > 0 ||
            Object.keys(indicateursErrors.value).length > 0
    );
    // Réplique exacte du watch corrigé du composant.
    watch(
        () => values.indicateurs,
        async () => {
            const result = await validate({ mode: "silent" });
            const fieldResult = result.results["indicateurs"];
            if (!fieldResult || fieldResult.valid) {
                indicateursErrors.value = {};
                Object.keys(errors.value)
                    .filter((key) => key.startsWith("indicateurs"))
                    .forEach((key) => setFieldError(key, undefined));
                return;
            }
            indicateursErrors.value = fieldResult.errors.reduce((acc, msg) => {
                const match =
                    typeof msg === "string"
                        ? msg.match(/^FIELD:([^|]+)\|MESSAGE:(.+)$/)
                        : null;
                if (match) {
                    acc[match[1]] = match[2];
                }
                return acc;
            }, {});
        },
        { deep: true }
    );
    // Simule la réponse 400 du backend (cf. performSubmit catch).
    const applyBackendError = () => {
        globalError.value = "Le nombre de mineurs scolarisés...";
        setErrors({ [BACKEND_ERROR_KEY]: ["requiert identifiés"] });
    };
    // Simule la correction utilisateur (reset de l'erreur globale comme performSubmit).
    const correct = (value) => {
        globalError.value = null;
        indicateurs.value[YEAR].scolaire_mineurs_moins_de_trois_ans = value;
    };
    api = { errors, indicateursErrors, hasErrors, applyBackendError, correct };
}

describe("Reset des erreurs d'indicateurs après correction (bouton grisé)", () => {
    it("purge l'erreur backend détaillée et dégrise le bouton après correction", async () => {
        const Comp = defineComponent({
            setup() {
                mountForm({
                    indicateurs: {
                        [YEAR]: { scolaire_mineur_scolarise_dans_annee: 2 },
                    },
                });
                return () => h("div");
            },
        });
        mount(Comp);

        // 1. Clic "Mettre à jour" => 400 backend => erreur posée sous clé détaillée
        api.applyBackendError();
        await nextTick();
        expect(api.hasErrors.value).toBe(true);
        expect(Object.keys(api.errors.value)).toContain(BACKEND_ERROR_KEY);

        // 2. Correction : on renseigne les mineurs identifiés => deep watch (silent)
        api.correct("4");
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 60));

        // 3. L'erreur backend doit être purgée et le bouton se dégriser
        expect(api.hasErrors.value).toBe(false);
        expect(Object.keys(api.errors.value)).toHaveLength(0);
    });

    it("garde le bouton grisé tant que l'erreur n'est pas réellement corrigée", async () => {
        const Comp = defineComponent({
            setup() {
                mountForm({
                    indicateurs: {
                        [YEAR]: { scolaire_mineur_scolarise_dans_annee: 2 },
                    },
                });
                return () => h("div");
            },
        });
        mount(Comp);

        api.applyBackendError();
        await nextTick();

        // On modifie un champ sans corriger la cause (toujours pas d'identifiés valides)
        api.correct("");
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 60));

        expect(api.hasErrors.value).toBe(true);
    });
});
