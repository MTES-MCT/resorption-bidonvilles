<template>
    <Modal closeWhenClickOutside ref="modale">
        <template v-slot:title
            >Confirmez-vous la demande d'information ?</template
        >
        <template v-slot:body>
            <div class="mt-6">
                <p class="mb-2">
                    Vous êtes sur le point de demander les coordonnées du
                    propriétaire de la parcelle cadastrale
                    <span class="font-bold text-primary">{{ parcel }}</span
                    >.
                </p>
                <p class="mb-2">
                    Ces données sont extraites des éléments du cadastre de
                    l'année
                    <span class="font-bold">{{ dataYear }}</span
                    >.
                </p>
                <p class="mb-2">
                    Si le site est localisé sur plusieurs parcelles, il convient
                    de modifier manuellement le point de localisation et
                    procéder à une nouvelle demande pour chaque parcelle.
                </p>
                <p class="font-bold pl-2">Ces demandes sont tracées:</p>
            </div>
            <div class="mt-4 p-4 text-sm bg-G300 rounded-md">
                <p>
                    Nous vous rappelons que
                    <span class="font-bold"
                        >les fichiers fonciers non anonymisés contiennent des
                        données personnelles directes </span
                    >(nom des propriétaires personnes physiques).
                    <span class="font-bold"
                        >Leur utilisation est donc soumise à une réglementation
                        particulière et des obligations strictes.</span
                    >
                    Nous devons être en mesure de fournir, sur demande de la
                    DGALN* ou de la DGFIP**, les nom, prénom, structure,
                    territoires d'intervention du demandeur et référence de la
                    parcelle cadastrale faisant l'objet de la demande.
                    <span class="font-bold"
                        >Ces informations sont donc enregistrées.</span
                    >
                </p>
                <p class="pt-2 font-bold">
                    En tant qu'utilisateur de la plateforme
                    Résorption-Bidonvilles, vous vous engagez donc à ne demander
                    que les informations strictement utiles dans le cadre de vos
                    missions.
                </p>
                <p class="pt-2 italic">
                    * Direction générale de l'aménagement, du logement et de la
                    nature
                </p>
                <p class="pb-2 italic">
                    ** Direction générale des Finances publiques
                </p>
            </div>
            <ErrorSummary
                v-if="error"
                :message="error"
                :summary="errorSummary"
                class="mb-0 mt-6"
            />
        </template>

        <template v-slot:footer>
            <Button variant="primaryText" @click="() => modale.close()"
                >Annuler</Button
            >
            <Button class="ml-5" :loading="loading" @click="fetchParcelOwners">
                Confirmer</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { useNotificationStore } from "@/stores/notification.store";
import { getParcelOwners } from "@/api/majic.api.js";

import { Modal, Button, ErrorSummary } from "@resorptionbidonvilles/ui";

const props = defineProps({
    parcel: {
        type: String,
        required: true,
    },
    departement: {
        type: String,
        required: true,
    },
    dataYear: {
        type: String,
        required: true,
    },
});
const { parcel, departement, dataYear } = toRefs(props);

const modale = ref(null);
const loading = ref(false);
const error = ref(null);
const errorSummary = ref({});

async function fetchParcelOwners() {
    if (loading.value === true) {
        return;
    }

    loading.value = true;
    error.value = null;
    errorSummary.value = {};
    const notificationStore = useNotificationStore();
    try {
        console.log("getParcelOwners", parcel.value, departement.value);
        await getParcelOwners(parcel.value, departement.value);
        notificationStore.success(
            "Message envoyé !",
            "Les informations ont été envoyées à l'adresse renseignée dans votre profil. Cette demande est tracée."
        );
    } catch (e) {
        notificationStore.error(
            "Une erreur est survenue",
            e?.user_message ||
                `Nous n'avons pu récupérer les informations relatives au propriétaire de la parcelle ${parcel.value}.`
        );
    }
    modale.value.close();
    loading.value = false;
}
</script>
