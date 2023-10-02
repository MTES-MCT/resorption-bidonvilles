<template>
    <div class="flex justify-between space-x-6">
        <section class="flex space-x-6 flex-1">
            <p><MiniCarte :location="mapLocation" /></p>
            <div>
                <p class="text-3xl text-info font-bold">{{ title }}</p>
                <p class="mt-2">
                    {{ directoryStore.total }} structure{{
                        directoryStore.total > 1 ? "s" : ""
                    }}
                </p>
                <p>
                    {{ numberOfUsers }}
                    utilisateur{{ numberOfUsers > 1 ? "s" : "" }}
                </p>
            </div>
        </section>
        <div class="max-w-lg">
            <header class="font-bold border-b mb-2">
                <Icon icon="info-circle" /> Information
            </header>
            <p>
                Ce pictogramme
                <IconeAdministrateur />
                identifie les administrateurs locaux, qui gèrent les accès des
                utilisateurs de leur territoire et sont sollicités pour toute
                question sur la plate-forme.
            </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";
import MiniCarte from "@/components/MiniCarte/MiniCarte.vue";
import { Icon } from "@resorptionbidonvilles/ui";
import IconeAdministrateur from "@/components/IconeAdministrateur/IconeAdministrateur.vue";

const props = defineProps({
    location: {
        type: Object,
        required: true,
    },
    search: {
        type: String,
        required: true,
    },
});
const { location, search } = toRefs(props);
const directoryStore = useDirectoryStore();
const mapLocation = computed(() => {
    return location.value || { typeUid: "nation" };
});
const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});
const numberOfUsers = computed(() => {
    return directoryStore.filteredOrganizations.reduce(
        (total, organization) => {
            return total + (organization.users?.length || 0);
        },
        0
    );
});
</script>
