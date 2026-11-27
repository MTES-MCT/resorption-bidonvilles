<template>
    <DsfrModal
        :opened="isOpen"
        :title="title"
        title-tag="h2"
        :origin="origin"
        @close="closeModal"
    >
        <hr class="fr-hr" />
        <template v-if="!showYearScreen">
            <template v-if="exportList.length > 0">
                <p>{{ introText }}</p>
                <ul class="fr-raw-list fr-mt-3v">
                    <li v-if="hasActionsExport">
                        <button
                            :id="CHOOSE_YEAR_LINK_ID"
                            type="button"
                            class="fr-link"
                            @click.stop="toggleActionsExportIsSelected"
                        >
                            <VIcon
                                name="ri:file-excel-fill"
                                class="fr-mr-1v"
                                aria-hidden="true"
                            />
                            Choisir l'année et exporter les actions
                        </button>
                    </li>
                    <li
                        v-for="exportItem in linksForBody"
                        :key="exportItem.filename"
                    >
                        <ModalExportLien
                            :label="exportItem.label"
                            :filename="exportItem.filename"
                            :downloadFn="exportItem.downloadFn"
                            :format="exportItem.format"
                            @export-error="onExportError"
                        />
                    </li>
                </ul>
            </template>
            <p v-else>Aucun export n'est disponible</p>
        </template>
        <template v-else>
            <ModalExportListeAnnee
                :years="years"
                :selectedYear="selectedYear"
                @year-selected="handleYearSelected"
            />
        </template>
        <!-- Conteneur permanent : une région live doit exister avant l'insertion de l'alerte pour être annoncée. -->
        <div role="alert">
            <div v-if="error" class="fr-mt-2w">
                <DsfrAlert type="error" :description="error" small />
            </div>
        </div>

        <!-- Pied affiché uniquement sur l'écran « année » : la fermeture se fait par le bouton « Fermer » de DsfrModal. -->
        <template v-if="showYearScreen" #footer>
            <!-- Ordre du DOM = ordre visuel (action secondaire, puis action principale à droite). -->
            <DsfrButtonGroup inlineLayoutWhen="md" align="right">
                <!-- Pas d'« Annuler » quand l'export des actions est le seul export : il n'y a pas de liste où revenir. -->
                <li v-if="!isOnlyActionsExport">
                    <DsfrButton
                        secondary
                        size="md"
                        label="Annuler"
                        @click.stop="toggleActionsExportIsSelected"
                    />
                </li>
                <li
                    v-for="exportItem in displayedFooterExports"
                    :key="exportItem.filename"
                >
                    <ModalExportLien
                        :shape="exportItem.shape"
                        :label="exportItem.label"
                        :filename="exportItem.filename"
                        :downloadFn="exportItem.downloadFn"
                        :format="exportItem.format"
                        :disabled="!selectedYear"
                        :year="selectedYear"
                        @export-error="onExportError"
                    />
                </li>
            </DsfrButtonGroup>
        </template>
    </DsfrModal>
</template>

<script setup>
import {
    ref,
    computed,
    toRefs,
    toValue,
    watch,
    nextTick,
    onMounted,
    onBeforeUnmount,
} from "vue";
import ModalExportLien from "@/components/ModalExport/ModalExportLien.vue";
import ModalExportListeAnnee from "@/components/ListeDesActions/ListeDesActionsExport/ListeDesActionsExportListeAnnees.vue";

const props = defineProps({
    exports: Array,
    // Fourni par App.vue : la modale n'est montée que lorsqu'elle est ouverte.
    isOpen: {
        type: Boolean,
        default: true,
    },
});
const emit = defineEmits(["close"]);

// Doit rester aligné sur `select-id` de ListeDesActionsExportListeAnnees.vue.
const YEAR_SELECT_ID = "selected_year_for_actions_export";
const CHOOSE_YEAR_LINK_ID = "export-choisir-annee-lien";
const { exports: exportList } = toRefs(props);
const actionsExportIsSelected = ref(false);
const error = ref(null);

const selectedYear = ref(new Date().getFullYear() - 1);

// Élément qui avait le focus à l'ouverture (le bouton « Exporter ») : DsfrModal
// lui rend le focus à la fermeture.
const openerElement = document.activeElement;
const origin = {
    focus: function focusOpener() {
        if (openerElement instanceof HTMLElement && openerElement.isConnected) {
            openerElement.focus();
        }
    },
};

function isActionsExport(exportItem) {
    return exportItem.filename === "actions";
}

function isDisplayedOnBody(exportItem) {
    return exportItem.displayedOn === "body";
}

function isDisplayedOnFooter(exportItem) {
    return exportItem.displayedOn === "footer";
}

// L'entrée « actions » peut être absente (aucune action exportable) : le lien
// de choix de l'année n'a alors pas lieu d'être.
const hasActionsExport = computed(function computeHasActionsExport() {
    return exportList.value.some(isActionsExport);
});

const years = computed(function computeYears() {
    const actionExport = exportList.value.find(isActionsExport);

    if (!actionExport?.years) {
        return [];
    }

    // `years` peut être une ref ou déjà un tableau
    return toValue(actionExport.years) || [];
});

// Année par défaut : année en cours - 1, ou la première année disponible la plus proche
const defaultYear = computed(function computeDefaultYear() {
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear - 1;
    const availableYears = years.value || [];

    if (availableYears.length === 0) {
        return targetYear;
    }

    // Si l'année cible existe dans la liste, l'utiliser
    const availableYearsSet = new Set(availableYears);
    if (availableYearsSet.has(targetYear)) {
        return targetYear;
    }

    // Sinon, trouver l'année disponible la plus proche et antérieure à l'année en cours
    const pastYears = availableYears.filter(function isPastYear(year) {
        return year < currentYear;
    });
    if (pastYears.length > 0) {
        // Retourner l'année la plus récente parmi les années passées
        return Math.max(...pastYears);
    }

    // Si aucune année passée n'est disponible, retourner la première année disponible
    return Math.min(...availableYears);
});

// Mettre à jour selectedYear quand defaultYear change (quand les années sont chargées)
watch(
    defaultYear,
    function applyDefaultYear(newDefaultYear) {
        selectedYear.value = newDefaultYear;
    },
    { immediate: true }
);

// L'export des actions est-il le seul export proposé ? Dans ce cas, la modale
// s'ouvre directement sur l'écran « année » (la liste ne contiendrait qu'un lien).
const isOnlyActionsExport = computed(function computeIsOnlyActionsExport() {
    return (
        exportList.value.length > 0 && exportList.value.every(isActionsExport)
    );
});

// Écran « année » affiché : choix explicite de l'utilisateur, ou export unique.
// Calculé (et non copié à l'ouverture) pour rester cohérent si `exports` change.
const showYearScreen = computed(function computeShowYearScreen() {
    return (
        isOnlyActionsExport.value ||
        (actionsExportIsSelected.value && hasActionsExport.value)
    );
});

function toggleActionsExportIsSelected() {
    actionsExportIsSelected.value = !actionsExportIsSelected.value;
}

// L'élément qui avait le focus est démonté lors d'un changement d'écran : on
// redonne le focus à un élément de l'écran affiché pour ne pas le perdre.
watch(
    showYearScreen,
    async function focusDisplayedScreen(isYearScreen) {
        await nextTick();
        document
            .getElementById(isYearScreen ? YEAR_SELECT_ID : CHOOSE_YEAR_LINK_ID)
            ?.focus();
    },
    { flush: "post" }
);

// Ouverture directe sur l'écran « année » : DsfrModal impose le focus initial
// sur la croix (initialFocus du focus-trap, non configurable). On le reprend une
// fois le trap activé (délai 0) et avant le setTimeout de 100 ms de DsfrModal.
let initialFocusTimer = null;
onMounted(function focusYearSelectOnDirectOpening() {
    if (!showYearScreen.value) {
        return;
    }

    initialFocusTimer = setTimeout(function focusYearSelect() {
        document.getElementById(YEAR_SELECT_ID)?.focus();
    }, 50);
});
onBeforeUnmount(function clearInitialFocusTimer() {
    clearTimeout(initialFocusTimer);
});

function handleYearSelected(year) {
    selectedYear.value = year;
}

const linksForBody = computed(function computeLinksForBody() {
    return exportList.value.filter(isDisplayedOnBody);
});

const linksForFooter = computed(function computeLinksForFooter() {
    return exportList.value.filter(isDisplayedOnFooter);
});

// Le bouton d'export des actions n'apparaît qu'une fois l'écran « année » affiché.
const displayedFooterExports = computed(
    function computeDisplayedFooterExports() {
        return linksForFooter.value.filter(function isDisplayed(exportItem) {
            return isActionsExport(exportItem) && showYearScreen.value;
        });
    }
);

// Nombre d'entrées listées sur l'écran de choix : lien « Choisir l'année » inclus.
const listedExportsCount = computed(function computeListedExportsCount() {
    return (hasActionsExport.value ? 1 : 0) + linksForBody.value.length;
});

const introText = computed(function computeIntroText() {
    return listedExportsCount.value === 1
        ? "Un export est disponible, cliquez dessus pour le télécharger :"
        : "Plusieurs exports sont disponibles, cliquez sur celui qui vous intéresse pour le télécharger :";
});

const title = computed(function computeTitle() {
    return showYearScreen.value ? "Export des actions" : "Exports";
});

function onExportError(message) {
    error.value = message || null;
}

function closeModal() {
    origin.focus();
    emit("close");
}
</script>
