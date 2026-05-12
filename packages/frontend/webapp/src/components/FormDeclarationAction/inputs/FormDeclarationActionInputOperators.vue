<template>
    <div>
        <InputUsers
            name="operators"
            :label="labels.operators"
            info="Saisissez ci-dessous le nom d'un acteur pour l'ajouter à la liste"
            placeholder="Nom d'un utilisateur de la plateforme"
            usersOnly
            showMandatoryStar
        />

        <DsfrRadioButtonSet
            v-if="activeUsers.length >= 2"
            v-model="selectedPrincipalId"
            :name="RADIO_GROUP_NAME"
            :legend="labels.principalOperator"
            :options="radioOptions"
            class="fr-mt-2w"
        />
    </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useField } from "vee-validate";
import InputUsers from "@/components/InputUsers/InputUsers.vue";
import labels from "../FormDeclarationAction.labels";

const RADIO_GROUP_NAME = "operators-principal";

const { value: operatorsField } = useField("operators");

const users = computed(() => operatorsField.value?.users ?? []);

const activeUsers = computed(() =>
    users.value.filter((u) => u.label !== "Utilisateur Désactivé")
);

const selectedPrincipalId = computed({
    get() {
        const principal = activeUsers.value.find(
            (u) => u.is_principal === true
        );
        return principal ? principal.id : activeUsers.value[0]?.id ?? null;
    },
    set(newId) {
        users.value.forEach((u) => {
            u.is_principal = u.id === newId;
        });
    },
});

const radioOptions = computed(() =>
    activeUsers.value.map((u) => ({
        label: u.label,
        value: u.id,
    }))
);

// Auto-marquer un opérateur principal pour éviter une soumission rejetée silencieusement :
//  - 0 actif : ne rien faire
//  - 1 actif : forcer is_principal=true sur l'unique actif (le radio n'est pas affiché)
//  - ≥ 2 actifs : si aucun actif n'est marqué principal, marquer le premier actif par défaut
//    (l'utilisateur peut ensuite changer via le radio group)
//
// Note : activeUsers.value est un tableau filtré par .filter(), qui préserve les
// références d'objets de users.value. Toute mutation sur activeUsers.value[i] est
// donc propagée directement à l'objet correspondant dans users.value.
watch(
    activeUsers,
    (newActiveUsers) => {
        if (newActiveUsers.length === 0) {
            return;
        }

        if (newActiveUsers.length === 1) {
            newActiveUsers[0].is_principal = true;
            return;
        }

        const hasPrincipal = newActiveUsers.some(
            (u) => u.is_principal === true
        );
        if (!hasPrincipal) {
            newActiveUsers[0].is_principal = true;
        }
    },
    { deep: true, immediate: true }
);
</script>
