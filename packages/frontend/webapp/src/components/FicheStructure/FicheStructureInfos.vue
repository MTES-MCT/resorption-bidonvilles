<template>
    <div
        class="flex flex-col md:grid mb-8 gap-4 md:gap-8"
        :class="
            userStore.user?.is_admin && secondaryAreas
                ? 'md:grid-cols-4'
                : 'md:grid-cols-3'
        "
    >
        <div>
            <div class="font-bold">Territoire(s) d'intervention :</div>
            <div class="text-md">
                {{ mainAreas }}
            </div>
        </div>
        <div v-if="userStore.user?.is_admin && secondaryAreas">
            <div class="font-bold">Autres territoires :</div>
            <div class="text-md">
                {{ secondaryAreas }}
            </div>
        </div>
        <div v-if="userStore.user?.is_superuser">
            <div class="font-bold">Financement:</div>
            <div class="text-md">
                {{ organization.being_funded ? "Oui" : "Non" }}
            </div>
        </div>
        <div v-if="userStore.user?.is_superuser">
            <div class="font-bold">Date de mise à jour:</div>
            <div class="text-md">
                {{ beingFundedDate }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import formatDate from "@common/utils/formatDate.js";

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
const mainAreas = computed(() => {
    if (organization.value.intervention_areas.is_national) {
        return "National";
    }

    return organization.value.intervention_areas.areas
        .filter((area) => area.is_main_area && area.type !== "nation")
        .map((area) => {
            let name = area[area.type].name;
            if (area.departement) {
                name += ` (${area.departement.code})`;
            }

            return name;
        })
        .join(", ");
});
const secondaryAreas = computed(() => {
    return organization.value.intervention_areas.areas
        .filter((area) => !area.is_main_area)
        .map((area) => {
            let name =
                area.type === "nation" ? "National" : area[area.type].name;
            if (area.departement) {
                name += ` (${area.departement.code})`;
            }

            return name;
        })
        .join(", ");
});
</script>
