<template>
    <Modal :closeWhenClickOutside="!working" ref="modale">
        <template v-slot:title>Mise à jour sans modification</template>
        <template v-slot:body>
            <div class="fr-text">
                <p class="fr-mb-3w">
                    Vous vous apprêtez à enregistrer une mise à jour du site
                    sans avoir modifié aucune donnée.
                </p>
                <p class="fr-mb-3w">
                    Cette action mettra à jour la date de dernière modification
                    du site dans la base de données, mais les informations du
                    site resteront identiques.
                </p>
                <p class="fr-text--bold">
                    Voulez-vous confirmer cette mise à jour ?
                </p>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end gap-2">
                <DsfrButton secondary :disabled="working" @click="closeModale"
                    >Annuler</DsfrButton
                >
                <DsfrButton :disabled="working" @click="confirmUpdate">
                    <Spinner v-show="working" class="loader" />
                    Confirmer la mise à jour</DsfrButton
                >
            </div>
        </template>
    </Modal>
</template>
<script setup>
import { toRefs, ref } from "vue";
import { Modal, Spinner } from "@resorptionbidonvilles/ui";

const props = defineProps({
    onConfirm: {
        type: Function,
        required: true,
    },
});

const { onConfirm } = toRefs(props);
const modale = ref(null);
const working = ref(false);

const confirmUpdate = async () => {
    try {
        working.value = true;

        if (typeof onConfirm.value !== "function") {
            throw new TypeError("Action de confirmation indisponible");
        }

        await onConfirm.value();
        modale.value?.close();
    } finally {
        working.value = false;
    }
};

const closeModale = () => {
    modale.value?.close();
};
</script>
