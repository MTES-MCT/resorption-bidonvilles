<template>
    <div>
        <p>Aucun intervenant connu sur ce site.</p>
        <ButtonInviteActor class="mt-4" v-if="!town.closedAt" />
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import ButtonInviteActor from "./FicheSiteIntervenantsButtonInvite.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
