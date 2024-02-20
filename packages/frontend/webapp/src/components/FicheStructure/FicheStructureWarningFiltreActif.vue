<template>
    <Callout>
        <template v-slot:title>Filtre actif</template>

        <p>
            Attention, la liste des membres de cette structure est actuellement
            filtrée par sujets d'expertise.<br />
            <span class="font-bold">{{ wording.numberOfUsers }}</span>
            {{ wording.currentlyHidden }}.
        </p>
        <RbButton size="sm" @click="emit('resetFilters')" class="mt-4"
            >Cliquez ici pour retirer ce filtre</RbButton
        >
    </Callout>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { Button as RbButton, Callout } from "@resorptionbidonvilles/ui";

const props = defineProps({
    numberOfHiddenUsers: {
        type: Number,
        required: true,
    },
});
const { numberOfHiddenUsers } = toRefs(props);
const emit = defineEmits(["resetFilters"]);

const wording = computed(() => {
    if (numberOfHiddenUsers.value === 1) {
        return {
            numberOfUsers: "1 utilisateur",
            currentlyHidden: "est actuellement masqué",
        };
    }

    return {
        numberOfUsers: `${numberOfHiddenUsers.value} utilisateurs`,
        currentlyHidden: "sont actuellement masqués",
    };
});
</script>
