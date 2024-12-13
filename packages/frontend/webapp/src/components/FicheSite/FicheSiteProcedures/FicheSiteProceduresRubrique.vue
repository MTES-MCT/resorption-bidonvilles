<template>
    <FicheSousRubrique marginTop="false" border="false">
        <div class="ml-4">
            <div
                class="border-1 border-cardBorder rounded px-8 mt-2 hover:bg-G100 cursor-pointer"
                @click="toggleCollapse"
            >
                <div
                    :class="{
                        'border-b-2 border-G200 ': !collapsed,
                    }"
                    class="py-2 font-bold text-primary flex items-center justify-between"
                >
                    <div>
                        <span>
                            {{ title }}
                        </span>
                    </div>
                    <Button
                        :icon="collapsed ? 'chevron-up' : 'chevron-down'"
                        variant="primaryText"
                        type="button"
                    />
                </div>

                <div v-if="!collapsed">
                    <slot />
                </div>
            </div>
        </div>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";

import { Button } from "@resorptionbidonvilles/ui";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    title: String,
});
const { title } = toRefs(props);
const collapsed = ref(true);

function toggleCollapse() {
    collapsed.value = !collapsed.value;
}
</script>
