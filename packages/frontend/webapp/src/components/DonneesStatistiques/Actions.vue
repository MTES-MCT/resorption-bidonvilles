<template>
    <section class="flex space-x-3">
        <Button
            v-if="departementMetricsStore.activeTab === 'tableau'"
            variant="primaryOutline"
            :icon="parametresIcon"
            iconPosition="left"
            @click="toggleParametres"
            size="sm"
            class="!border-2 !border-primary hover:!bg-primaryDark"
            >{{ parametresWording }}</Button
        >
        <Button
            variant="primaryOutline"
            icon="file-excel"
            iconPosition="left"
            @click="print"
            size="sm"
            class="!border-2 !border-primary hover:!bg-primaryDark"
            >Exporter</Button
        >
    </section>
</template>

<script>
export default {
    name: "RbActions",
};
</script>

<script setup>
import domtoimage from "dom-to-image-more";
import downloadBlob from "@/utils/downloadBlob";
import { Button } from "@resorptionbidonvilles/ui";
import { useMetricsStore } from "@/stores/metrics.store";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import formatDate from "@common/utils/formatDate";
import { computed } from "vue";
import { trackEvent } from "@/helpers/matomo";

const metricsStore = useMetricsStore();
const departementMetricsStore = useDepartementMetricsStore();
const parametresIcon = computed(() => {
    return metricsStore.showParametres ? "filter-circle-xmark" : "filter";
});
const parametresWording = computed(() => {
    return metricsStore.showParametres
        ? "Masquer les paramètres"
        : "Voir les paramètres";
});

function toggleParametres() {
    metricsStore.showParametres = !metricsStore.showParametres;
}

async function print() {
    // on imprime
    const container = document.getElementById("printable-content");

    try {
        const blob = await domtoimage.toBlob(container, {
            width: container.offsetWidth,
            height: container.offsetHeight,
            bgcolor: "#ffffff",
            filter(node) {
                // pour une raison inconnue domtoimage rajoute des bordures grises énormes
                // à tous les éléments...
                // malheureusement impossible d'empêcher ces bordures via une feuille de style,
                // il faut obligatoirement rajouter un style inline à chaque élément pour
                // dire explicitement qu'on ne veut pas de bordure dessus
                // c'est ce qu'on fait ici : si le noeud n'est pas censé avoir une bordure
                // (via classe tailwind border-quelquechose) alors on set
                // explicitement sa bordure à 0
                if (node.style) {
                    const style = getComputedStyle(node);
                    const borders = {
                        full: parseInt(style.borderWidth) !== 0,
                        left: parseInt(style.borderLeftWidth) !== 0,
                        right: parseInt(style.borderRightWidth) !== 0,
                        top: parseInt(style.borderTopWidth) !== 0,
                        bottom: parseInt(style.borderBottomWidth) !== 0,
                    };

                    if (Object.values(borders).every((v) => v === false)) {
                        node.style.borderWidth = "0";
                    } else if (!borders.full) {
                        if (!borders.left) {
                            node.style.borderLeftWidth = "0";
                        }
                        if (!borders.right) {
                            node.style.borderRightWidth = "0";
                        }
                        if (!borders.top) {
                            node.style.borderTopWidth = "0";
                        }
                        if (!borders.bottom) {
                            node.style.borderBottomWidth = "0";
                        }
                    }
                }

                return true;
            },
        });
        const ts = Date.now() / 1000;
        downloadBlob(blob, `export-donnees-${formatDate(ts, "y-m-d")}.png`);
        trackEvent("Visualisation des données nationales", "Export");
    } catch (error) {
        console.log("Failed printing the data");
    }
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
