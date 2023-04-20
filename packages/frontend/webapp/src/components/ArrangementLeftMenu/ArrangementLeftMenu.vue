<template>
    <div class="flex space-x-8 justify-center">
        <ArrangementLeftMenuColumn
            :tabs="tabs"
            :activeTab="computedActiveTab"
            class="print:hidden mb-12"
            :class="columnWidthClass"
        >
            <template v-slot:title v-if="$slots.menuTitle"
                ><slot name="menuTitle"
            /></template>
        </ArrangementLeftMenuColumn>

        <div class="flex-1" :class="maxWClass">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed, toRefs, onMounted, onBeforeUnmount } from "vue";
import ArrangementLeftMenuColumn from "./ArrangementLeftMenuColumn.vue";
import router from "@/helpers/router";

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
    activeTab: {
        // id de la tab actuellement active
        type: String,
        required: false,
    },
    autonav: {
        // si cette option est activée, alors la tab active est celle dont l'id est égale au hash
        // de la route courante
        // activeTab est donc calculé automatiquement, et la route est mise à jour automatiquement
        // avec le scroll de l'utilisateur
        type: Boolean,
        required: false,
        default: false,
    },
    maxWClass: {
        type: String,
        required: false,
        default: null,
    },
    columnWidthClass: {
        type: String,
        required: false,
        default: null,
    },
});

const { tabs, activeTab, autonav, maxWClass } = toRefs(props);

onMounted(() => {
    window.addEventListener("scroll", handleMenuScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleMenuScroll);
});

function handleMenuScroll() {
    if (autonav.value === false) {
        return;
    }

    const tab = tabs.value.find(({ id }) => {
        const el = document.getElementById(id);
        // la section active est la première dont la bordure supérieure est visible à l'écran
        // OU dont la bordure inférieure dépasse la moitié de l'écran
        return (
            el?.offsetTop >= window.scrollY ||
            el?.offsetTop + el?.offsetHeight >
                window.scrollY + document.body.offsetHeight / 2
        );
    });

    if (tab?.id) {
        router.setHashWithoutScroll(`#${tab?.id}`);
    }
}

const computedActiveTab = computed(() => {
    if (autonav.value === false) {
        return activeTab.value;
    }

    return router.currentRoute.value.hash.slice(1) || tabs.value[0]?.id;
});
</script>
