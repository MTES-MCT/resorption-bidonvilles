<template>
    <section class="grid grid-cols-2 gap-4">
        <article v-for="shantytown in shantytowns" :key="shantytown.id">
            <div class="flex items-center">
                <Icon
                    icon="map-marker-alt"
                    class="text-lg"
                    :style="`color: ${shantytown.fieldType.color}`"
                />
                <div class="font-bold ml-2 whitespace-nowrap">
                    {{ shantytown.fieldType.label }}
                </div>
            </div>

            <Link :to="`/site/${shantytown.id}`"
                >{{ shantytown.usename }}, {{ shantytown.city.name }}</Link
            >
        </article>
    </section>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import enrichShantytown from "@/utils/enrichShantytown";
import { Icon, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
const configStore = useConfigStore();

const shantytowns = computed(() => {
    if (!Array.isArray(plan.value.shantytowns)) {
        return [];
    }

    return plan.value.shantytowns.map((shantytown) =>
        enrichShantytown(shantytown, configStore.config.field_types)
    );
});
</script>
