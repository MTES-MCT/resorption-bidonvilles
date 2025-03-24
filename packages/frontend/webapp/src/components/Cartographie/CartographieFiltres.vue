<template>
    <section v-if="isOpen" class="px-4 pt-6 overflow-auto max-h-screen">
        <aside class="text-sm text-right mb-3">
            <Link withStyle @click="onClose"
                ><Icon icon="arrow-left" /> Masquer cette barre</Link
            >
        </aside>
        <header class="font-bold text-lg mb-2">
            <h1>Filtrer les sites par</h1>
        </header>
        <div v-for="filterId in mapFilters.order" :key="filterId">
            <CartographieFiltre
                :id="filterId"
                @change="emit('filterUse', filterId)"
            />
        </div>
    </section>

    <section v-else class="w-5">
        <p
            class="rounded-full border bg-G100 border-G500 absolute top-20 left-1 z-[1002] w-8 h-8 flex items-center justify-center cursor-pointer hover:border-black"
            @click="emit('open')"
        >
            <Icon icon="arrow-right" />
        </p>
    </section>
</template>

<script setup>
import { toRefs, defineProps, defineEmits } from "vue";
import mapFilters from "@/utils/map_filters";
import { trackEvent } from "@/helpers/matomo";
import { Icon, Link } from "@resorptionbidonvilles/ui";
import CartographieFiltre from "./CartographieFiltre.vue";

const emit = defineEmits(["open", "close", "filterUse"]);
const props = defineProps({
    isOpen: {
        type: Boolean,
        required: false,
        default: true,
    },
});

const { isOpen } = toRefs(props);

function onClose() {
    emit("close");
    trackEvent("Cartographie", "Masquer les filtres");
}
</script>
