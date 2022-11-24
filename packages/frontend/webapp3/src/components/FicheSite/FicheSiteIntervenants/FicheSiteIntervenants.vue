<template>
    <FicheSiteRubrique title="Intervenants">
        <FicheSiteIntervenantsVide
            v-if="town.actors.length === 0"
            :town="town"
            class="my-4"
        />
        <FicheSiteIntervenantsListe v-else :town="town" class="my-4" />

        <FicheSiteIntervenantsCTA v-if="!self && !town.closedAt" />

        <FicheSiteModaleMesThemes :town="town" ref="modaleMesThemes" />
        <FicheSiteModaleInviterIntervenant
            :town="town"
            ref="modaleInviterIntervenant"
        />
    </FicheSiteRubrique>
</template>

<script setup>
import { computed, defineProps, toRefs, watch, ref, onMounted } from "vue";
import router from "@/helpers/router";
import { useEventBus } from "@/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";

import FicheSiteRubrique from "../FicheSiteRubrique.vue";
import FicheSiteIntervenantsCTA from "./FicheSiteIntervenantsCTA.vue";
import FicheSiteIntervenantsVide from "./FicheSiteIntervenantsVide.vue";
import FicheSiteIntervenantsListe from "./FicheSiteIntervenantsListe.vue";
import FicheSiteModaleMesThemes from "../FicheSiteModaleMesThemes/FicheSiteModaleMesThemes.vue";
import FicheSiteModaleInviterIntervenant from "../FicheSiteModaleInviterIntervenant/FicheSiteModaleInviterIntervenant.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();
const { bus } = useEventBus();
const modaleMesThemes = ref(null);
const modaleInviterIntervenant = ref(null);

const self = computed(() => {
    return town.value.actors.find(({ id }) => id === userStore.id);
});

onMounted(() => {
    if (router.currentRoute.value.query.action === "new_actor") {
        modaleMesThemes.value.open("Confirmez-vous intervenir sur ce site ?");
    }
});

watch(
    () => bus.value.get("fichesite:openInviteActorModal"),
    () => {
        modaleInviterIntervenant.value.open();
    }
);

watch(
    () => bus.value.get("fichesite:openSelfThemes"),
    () => {
        modaleMesThemes.value.open();
    }
);
</script>
