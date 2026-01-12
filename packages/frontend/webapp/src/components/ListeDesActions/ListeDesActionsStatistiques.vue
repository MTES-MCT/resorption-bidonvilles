<template>
    <div class="flex justify-between space-x-6">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <h1 class="text-3xl text-info font-bold">{{ title }}</h1>
                <p>
                    {{
                        actionsStore.filteredActions[
                            actionsStore.filters.status
                        ].length
                    }}
                    action<template
                        v-if="
                            actionsStore.filteredActions[
                                actionsStore.filters.status
                            ].length > 1
                        "
                        >s</template
                    >
                    <template v-if="actionsStore.filters.status === 'open'"
                        >&nbsp;en cours</template
                    >
                    <template v-else
                        >&nbsp;terminée<template
                            v-if="
                                actionsStore.filteredActions[
                                    actionsStore.filters.status
                                ].length > 1
                            "
                            >s</template
                        ></template
                    >
                </p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useActionsStore } from "@/stores/actions.store";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";
import MiniCarte from "@/components/MiniCarte/MiniCarte.vue";

const actionsStore = useActionsStore();
const { location, search } = toRefs(actionsStore.filters);

const mapLocation = computed(() => {
    return location.value || { typeUid: "nation" };
});
const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});
</script>
