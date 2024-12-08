<template>
    <Carto
        ref="carto"
        :layers="['Dessin', 'Satellite']"
        defaultLayer="Satellite"
        :defaultView="defaultView"
        :townMarkerFn="marqueurSiteEau"
        displaySkipMapLinks
    >
        <div
            ref="cadastreToggler"
            class="bg-white ml-3 my-3 border-2 border-G500 py-1 px-2 rounded print:hidden"
            v-show="cadastre"
        >
            <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="showCadastre" />
                <span>Voir le cadastre</span>
            </label>
        </div>
    </Carto>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import L from "leaflet";
import { useNotificationStore } from "@/stores/notification.store";
import copyToClipboard from "@/utils/copyToClipboard";
import Carto from "@/components/Carto/Carto.vue";
import marqueurSiteEau from "@/utils/marqueurSiteEau";

const props = defineProps({
    cadastre: {
        type: Object,
        required: false,
        default: null,
    },
    defaultView: Object,
});
const { cadastre, defaultView } = toRefs(props);

const carto = ref(null);
const cadastreToggler = ref(null);
const showCadastre = ref(false);
const notificationStore = useNotificationStore();
const markersGroup = ref(
    L.geoJSON([], {
        onEachFeature: handleParcelle,
    })
);

function createCadastreControl() {
    const CadastreToggler = L.Control.extend({
        options: {
            position: "bottomleft",
        },

        onAdd() {
            return cadastreToggler.value;
        },
    });

    return new CadastreToggler();
}

function handleParcelle(feature, layer) {
    const { numero, feuille, section, code_insee } = feature.properties;
    layer.bindTooltip(
        `N°${numero}<br/>Feuille ${feuille}<br/>Section ${section}<br/>N°INSEE ${code_insee}`
    );

    layer.on("click", () => {
        copyToClipboard(
            `N°${numero}\nFeuille ${feuille}\nSection ${section}\nN°INSEE ${code_insee}`
        );
        notificationStore.success(
            "Copie de la parcelle cadastrale",
            "Les données de cette parcelle cadastrale ont bien été copiées dans votre presse-papier"
        );
    });
}

watch(carto, () => {
    if (carto.value) {
        carto.value.addControl("cadastreToggler", createCadastreControl());
    }
});

watch(cadastre, () => {
    markersGroup.value.clearLayers();
    markersGroup.value.addData(cadastre.value);
});

watch(showCadastre, () => {
    const { map } = carto.value;

    if (showCadastre.value === false) {
        if (map.hasLayer(markersGroup.value)) {
            map.removeLayer(markersGroup.value);
        }
    } else if (!map.hasLayer(markersGroup.value)) {
        map.addLayer(markersGroup.value);
        map.setView(defaultView.value.center, 18);
    }
});
</script>
