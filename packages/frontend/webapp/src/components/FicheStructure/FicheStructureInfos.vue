<template>
    <div
        class="grid mb-8"
        :class="
            userStore.user?.is_admin && secondaryAreas
                ? 'grid-cols-4'
                : 'grid-cols-3'
        "
    >
        <div>
            <div>Territoire(s) d'intervention :</div>
            <div class="text-lg">
                {{ mainAreas }}
            </div>
        </div>
        <div v-if="userStore.user?.is_admin && secondaryAreas">
            <div>Autres territoires :</div>
            <div class="text-lg">
                {{ secondaryAreas }}
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
