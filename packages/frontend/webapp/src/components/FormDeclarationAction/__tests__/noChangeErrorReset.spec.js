/**
 * Test de non-régression : le message applicatif "Modification impossible :
 * aucun champ n'a été modifié" doit disparaître dès que l'utilisateur re-modifie
 * un champ (carte 2560).
 *
 * Cause historique : ce message est posé dans error.value lors d'une soumission
 * sans changement. Or error.value n'était remis à null que par le watch sur
 * useFormErrors() (erreurs vee-validate). Ce message n'étant PAS une erreur de
 * validation, modifier un champ ne déclenchait pas ce nettoyage : le message
 * restait collé, hasErrors restait vrai et le bouton "Mettre à jour" grisé.
 *
 * Fix : dans updateHasChanges(), effacer ce message dès que hasChanges repasse
 * à true. Ce test reproduit la logique de updateHasChanges sans monter tout le
 * composant (qui exige stores/router/API).
 */
import { describe, it, expect } from "vitest";
import { ref, computed, watch, nextTick } from "vue";
import _ from "lodash-es";

const NO_CHANGE_ERROR = "Modification impossible : aucun champ n'a été modifié";

function makeForm(initialValues) {
    const values = ref(_.cloneDeep(initialValues));
    const originalValues = ref(_.cloneDeep(initialValues));
    const error = ref(null);
    const hasChanges = ref(false);
    const hasErrors = computed(() => error.value !== null);

    // Réplique de updateHasChanges() avec le fix.
    const updateHasChanges = () => {
        if (!originalValues.value) {
            return;
        }
        hasChanges.value = !_.isEqual(originalValues.value, values.value);
        if (hasChanges.value && error.value === NO_CHANGE_ERROR) {
            error.value = null;
        }
    };
    watch(values, () => updateHasChanges(), { deep: true });

    // Réplique de la branche "aucun changement" de performSubmit().
    const submit = () => {
        if (_.isEqual(originalValues.value, values.value)) {
            error.value = NO_CHANGE_ERROR;
        }
    };

    return { values, error, hasChanges, hasErrors, submit };
}

describe("Reset du message 'aucun champ modifié'", () => {
    it("efface le message et dégrise le bouton après une modification", async () => {
        const form = makeForm({ name: "Action A", nombre: 1 });

        // 1. Clic "Mettre à jour" sans aucune modification
        form.submit();
        await nextTick();
        expect(form.hasErrors.value).toBe(true);
        expect(form.error.value).toBe(NO_CHANGE_ERROR);

        // 2. L'utilisateur modifie un champ
        form.values.value.nombre = 2;
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 10));

        // 3. Le message doit disparaître et le bouton se dégriser
        expect(form.hasErrors.value).toBe(false);
        expect(form.error.value).toBeNull();
        expect(form.hasChanges.value).toBe(true);
    });

    it("ne touche pas à une autre erreur applicative présente dans error.value", async () => {
        const form = makeForm({ name: "Action A" });
        // Erreur applicative distincte (ex. doublon d'adresse / message backend)
        form.error.value = "Une autre erreur";

        form.values.value.name = "Action B";
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 10));

        // L'autre erreur ne doit pas être effacée par mégarde
        expect(form.error.value).toBe("Une autre erreur");
    });
});
