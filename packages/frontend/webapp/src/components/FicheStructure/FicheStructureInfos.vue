<template>
    <div class="grid grid-cols-3 mb-8">
        <div>
            <div>Territoire :</div>
            <div class="text-lg">
                {{ organization.location_name }}
                <span v-if="organization.location_code"
                    >({{ organization.location_code }})</span
                >
            </div>
        </div>
        <div v-if="userStore.user?.is_superuser">
            <div>Financement:</div>
            <div class="text-lg">
                {{ organization.being_funded ? "Oui" : "Non" }}
            </div>
        </div>
        <div v-if="userStore.user?.is_superuser">
            <div>Date de mise à jour:</div>
            <div class="text-lg">
                {{ beingFundedDate }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import formatDate from "@/utils/formatDate";

const props = defineProps({
    organization: {
        type: Object,
        required: true,
    },
});
const { organization } = toRefs(props);
const userStore = useUserStore();

const beingFundedDate = computed(() => {
    return formatDate(
        new Date(organization.value.being_funded_at).getTime() / 1000,
        "d/m/y"
    );
});
</script>
