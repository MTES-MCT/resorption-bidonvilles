<template>
    <FicheSousRubrique marginTop="false" border="false">
        <div class="ml-4">
            <div
                :class="[
                    { 'pb-4': !collapsed },
                    'border-1 border-cardBorder rounded px-8 mt-2 hover:bg-G100',
                ]"
            >
                <button
                    type="button"
                    :class="{
                        'border-b-2 border-G200 ': !collapsed,
                    }"
                    class="rubrique-titre py-2 font-bold text-primary flex items-center justify-between cursor-pointer"
                    :aria-expanded="!collapsed"
                    :aria-controls="detailsId"
                    @click="toggleCollapse"
                >
                    <span>
                        <span>
                            {{ enrichedTitle }}
                        </span>
                    </span>
                    <Icon :icon="collapsed ? 'chevron-down' : 'chevron-up'" />
                </button>

                <div v-if="!collapsed" :id="detailsId">
                    <slot />
                </div>
            </div>
        </div>
    </FicheSousRubrique>
</template>

<script setup>
import { computed, toRefs, ref, useId } from "vue";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    title: String,
    titleSupplements: String,
});
const { title, titleSupplements } = toRefs(props);
const collapsed = ref(true);
const detailsId = `procedures-${useId()}`;

function toggleCollapse() {
    collapsed.value = !collapsed.value;
}

const enrichedTitle = computed(() => {
    if (titleSupplements.value !== "aucune information") {
        return titleSupplements.value;
    }
    return title.value + " - " + titleSupplements.value;
});
</script>

<style scoped>
.rubrique-titre {
    width: 100%;
    text-align: left;
}
</style>
