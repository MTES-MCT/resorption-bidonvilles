<template>
    <div>
        <div class="grid grid-cols-2 gap-4">
            <CarteIntervenantSelf v-if="self" :actor="self" :townId="town.id" />
            <CarteIntervenant
                v-for="actor in otherActors"
                :key="actor.id"
                :actor="actor"
            />
        </div>
        <ButtonInviteActor class="mt-4"
            >Inviter un autre intervenant</ButtonInviteActor
        >
    </div>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";

import CarteIntervenant from "@/components/CarteIntervenant/CarteIntervenant.vue";
import CarteIntervenantSelf from "@/components/CarteIntervenant/CarteIntervenantSelf.vue";
import ButtonInviteActor from "./FicheSiteIntervenantsButtonInvite.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();

const self = computed(() => {
    return town.value.actors.find(({ id }) => id === userStore.id);
});
const otherActors = computed(() => {
    return town.value.actors.filter(({ id }) => id !== userStore.id);
});
</script>
