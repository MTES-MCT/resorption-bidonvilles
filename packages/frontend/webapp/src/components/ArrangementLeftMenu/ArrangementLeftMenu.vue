<template>
    <div class="flex flex-col md:flex-row space-x-8">
        <ArrangementLeftMenuColumn
            :tabs="tabs"
            :activeTab="computedActiveTab"
            class="print:hidden mb-12 shrink-0"
            :class="{
                columnWidthClass: true,
                'hidden md:flex': autohide === true,
            }"
        >
            <template v-slot:title v-if="$slots.menuTitle"
                ><slot name="menuTitle"
            /></template>
        </ArrangementLeftMenuColumn>

        <div class="flex-1">
            <slot />
        </div>
    </div>
</template>

<script setup>
import router from "@/helpers/router";
import { computed, onBeforeUnmount, onMounted, toRefs } from "vue";
import ArrangementLeftMenuColumn from "./ArrangementLeftMenuColumn.vue";

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
    autohide: {
        // si cette option est activée, alors le menu de gauche est automatiquement masqué
        // pour les résolutions particulièrement petites (accessibilité)
        type: Boolean,
        required: false,
        default: true,
    },
    columnWidthClass: {
        type: String,
        required: false,
        default: null,
    },
});

const { tabs, activeTab, autonav } = toRefs(props);

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
