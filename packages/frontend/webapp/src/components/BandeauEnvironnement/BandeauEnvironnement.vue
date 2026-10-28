<template>
    <template v-if="label">
        <div
            class="bandeauEnvironnementReserve"
            :style="{ height: `${hauteur}px` }"
            aria-hidden="true"
        />
        <div ref="bandeau" class="z-[1000] fixed top-0 left-0 right-0">
            <DsfrNotice
                type="warning"
                :title="`Environnement de test (${label}) : les données ne sont pas réelles.`"
                :closeable="false"
            />
        </div>
    </template>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import env from "@/helpers/env";

const label = env.ENV_LABEL;
const bandeau = ref(null);
const hauteur = ref(0);
let observer = null;

function publierHauteur(valeur) {
    document.documentElement.style.setProperty(
        "--hauteur-bandeau-env",
        `${valeur}px`
    );
    document.documentElement.style.scrollPaddingTop =
        "var(--hauteur-bandeau-env)";
}

function mesurer() {
    if (!bandeau.value) {
        return;
    }
    hauteur.value = bandeau.value.getBoundingClientRect().height;
}

watch(hauteur, publierHauteur);

onMounted(function initialiserObservation() {
    if (!bandeau.value) {
        return;
    }
    mesurer();
    publierHauteur(hauteur.value);
    observer = new ResizeObserver(mesurer);
    observer.observe(bandeau.value);
});

onBeforeUnmount(function arreterObservation() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    document.documentElement.style.removeProperty("--hauteur-bandeau-env");
    document.documentElement.style.removeProperty("scroll-padding-top");
});
</script>
