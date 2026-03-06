<template>
    <Modal closeWhenClickOutside ref="modale">
        <template v-slot:title>Suppression de financements</template>
        <template v-slot:body>
            <div class="fr-text">
                <p class="fr-mb-3w">
                    {{ getMainMessage() }}
                </p>
                <ul class="fr-mb-3w">
                    <li
                        v-if="yearsBeforeMin.length > 0"
                        v-html="getBeforeMinMessage()"
                    ></li>
                    <li
                        v-if="yearsAfterMax.length > 0"
                        v-html="getAfterMaxMessage()"
                    ></li>
                </ul>
                <p class="fr-text--bold text-red-600">
                    Cette suppression est irréversible. Voulez-vous continuer ?
                </p>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end gap-2">
                <DsfrButton secondary @click="cancel">Annuler</DsfrButton>
                <DsfrButton @click="confirm"
                    >Confirmer la suppression</DsfrButton
                >
            </div>
        </template>
    </Modal>
</template>

<script setup>
import { toRefs, ref } from "vue";
import { Modal } from "@resorptionbidonvilles/ui";

const props = defineProps({
    yearsBeforeMin: {
        type: Array,
        required: true,
    },
    yearsAfterMax: {
        type: Array,
        required: true,
    },
    minYear: {
        type: Number,
        required: true,
    },
    maxYear: {
        type: Number,
        required: true,
    },
    minYearChanged: {
        type: Boolean,
        required: true,
    },
    maxYearChanged: {
        type: Boolean,
        required: true,
    },
    finances: {
        type: Object,
        required: true,
    },
    onConfirm: {
        type: Function,
        required: true,
    },
    onCancel: {
        type: Function,
        required: true,
    },
});

const {
    yearsBeforeMin,
    yearsAfterMax,
    minYear,
    maxYear,
    minYearChanged,
    maxYearChanged,
    finances,
    onConfirm,
    onCancel,
} = toRefs(props);
const modale = ref(null);

function formatFinancesSummary(years) {
    let totalLines = 0;
    let totalAmount = 0;

    years.forEach((year) => {
        const yearFinances = finances.value[year] || [];
        totalLines += yearFinances.length;
        totalAmount += yearFinances.reduce(
            (sum, f) => sum + (parseFloat(f.amount) || 0),
            0
        );
    });

    return `${totalLines} ligne${
        totalLines > 1 ? "s" : ""
    } (${totalAmount.toLocaleString("fr-FR")} €)`;
}

function getMainMessage() {
    if (minYearChanged.value && maxYearChanged.value) {
        return "Vous avez modifié la date de lancement et la date de fin prévue de l'action, ce qui va entraîner la suppression des lignes de financement :";
    } else if (minYearChanged.value) {
        return `Vous avez modifié la date de lancement de l'action, ce qui va entraîner la suppression des lignes de financement antérieures à l'année ${minYear.value} :`;
    } else if (maxYearChanged.value) {
        return `Vous avez modifié la date de fin prévue de l'action, ce qui va entraîner la suppression des lignes de financement postérieures à l'année ${maxYear.value} :`;
    }
    return "Vous avez modifié les dates de l'action, ce qui va entraîner la suppression de financements :";
}

function getBeforeMinMessage() {
    const years = yearsBeforeMin.value.sort(
        (a, b) => parseInt(a) - parseInt(b)
    );
    const yearsList = years.join(", ");
    const summary = formatFinancesSummary(years);

    if (minYearChanged.value && maxYearChanged.value) {
        return `<strong>Antérieures à l'année ${minYear.value} :</strong> années ${yearsList} - ${summary}`;
    }
    return `<strong>Années ${yearsList} :</strong> ${summary}`;
}

function getAfterMaxMessage() {
    const years = yearsAfterMax.value.sort((a, b) => parseInt(a) - parseInt(b));
    const yearsList = years.join(", ");
    const summary = formatFinancesSummary(years);

    if (minYearChanged.value && maxYearChanged.value) {
        return `<strong>Postérieures à l'année ${maxYear.value} :</strong> années ${yearsList} - ${summary}`;
    }
    return `<strong>Années ${yearsList} :</strong> ${summary}`;
}

const confirm = async () => {
    try {
        await onConfirm.value();
        modale.value.close();
    } catch (error) {
        console.error("Erreur lors de la confirmation:", error);
    }
};

const cancel = () => {
    onCancel.value();
    modale.value.close();
};
</script>
