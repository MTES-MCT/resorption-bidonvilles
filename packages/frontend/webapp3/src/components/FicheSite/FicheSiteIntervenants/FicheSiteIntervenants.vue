<template>
    <FicheSiteRubrique title="Intervenants">
        <FicheSiteIntervenantsVide
            v-if="town.actors.length === 0"
            class="my-4"
        />
        <FicheSiteIntervenantsListe v-else :town="town" class="my-4" />

        <FicheSiteIntervenantsCTA v-if="!self && !town.closedAt" />
    </FicheSiteRubrique>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";

import FicheSiteRubrique from "../FicheSiteRubrique.vue";
import FicheSiteIntervenantsCTA from "./FicheSiteIntervenantsCTA.vue";
import FicheSiteIntervenantsVide from "./FicheSiteIntervenantsVide.vue";
import FicheSiteIntervenantsListe from "./FicheSiteIntervenantsListe.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();

const self = computed(() => {
    return town.value.actors.find(({ id }) => id === userStore.id);
});
</script>
