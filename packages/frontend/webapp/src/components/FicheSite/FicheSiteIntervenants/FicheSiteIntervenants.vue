<template>
    <FicheRubrique title="Intervenants">
        <FicheSiteIntervenantsVide
            v-if="town.actors.length === 0"
            :town="town"
            class="my-4"
        />
        <FicheSiteIntervenantsListe v-else :town="town" class="my-4" />
        <FicheSiteIntervenantsCTA v-if="!self && !town.closedAt" />
    </FicheRubrique>
</template>

<script setup>
import { computed, defineProps, toRefs, watch, onMounted } from "vue";
import router from "@/helpers/router";
import { useEventBus } from "@common/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteIntervenantsCTA from "./FicheSiteIntervenantsCTA.vue";
import FicheSiteIntervenantsVide from "./FicheSiteIntervenantsVide.vue";
import FicheSiteIntervenantsListe from "./FicheSiteIntervenantsListe.vue";
import FicheSiteModaleMesThemes from "../FicheSiteModaleMesThemes/FicheSiteModaleMesThemes.vue";
import FicheSiteModaleInviterIntervenant from "../FicheSiteModaleInviterIntervenant/FicheSiteModaleInviterIntervenant.vue";
import { useModaleStore } from "@/stores/modale.store";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();
const { bus } = useEventBus();
const modaleStore = useModaleStore();

const self = computed(() => {
    return town.value.actors.find(({ id }) => id === userStore.id);
});

onMounted(() => {
    if (router.currentRoute.value.query.action === "new_actor") {
        modaleStore.open(FicheSiteModaleMesThemes, {
            town: town.value,
            title: "Confirmez-vous intervenir sur ce site ?",
        });
    }
});

watch(
    () => bus.value.get("fichesite:openInviteActorModal"),
    () => {
        modaleStore.open(FicheSiteModaleInviterIntervenant, {
            town: town.value,
        });
    }
);

watch(
    () => bus.value.get("fichesite:openSelfThemes"),
    () => {
        modaleStore.open(FicheSiteModaleMesThemes, {
            town: town.value,
        });
    }
);
</script>
