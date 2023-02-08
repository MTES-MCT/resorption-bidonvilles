<template>
    <Loading v-if="loading" />
    <div v-else @mouseenter="isHover = true" @mouseleave="isHover = false">
        <div v-if="permissionsToAccessJustice.length > 0">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CarteStructure
                    v-for="organization in permissionsToAccessJustice"
                    :key="organization.id"
                    :organization="organization"
                    :wording="wording"
                />
            </div>
        </div>
        <div v-else>
            <Icon icon="lock" class="text-red" />
            <span class="pl-1 font-bold">
                Seuls les utilisateurs en préfecture et DEETS / DREETS ont accès
                aux données judiciaires de ce site.</span
            >
        </div>
    </div>
</template>
<script setup>
import { defineProps, toRefs, ref } from "vue";
import CarteStructure from "@/components/CarteStructure/CarteStructure.vue";
import { Icon } from "@resorptionbidonvilles/ui";
import Loading from "@/components/Loading/Loading.vue";

const props = defineProps({
    permissionsToAccessJustice: Array,
    loading: Boolean,
});

const isHover = ref(false);
const { permissionsToAccessJustice, loading } = toRefs(props);

const wording = ref({
    first: "autorisé",
    second: "à accéder aux procédures judiciaires",
});
</script>
