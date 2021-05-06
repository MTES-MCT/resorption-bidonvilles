<template>
    <div class="flex items-stretch border-solid mb-8" v-if="shouldBeVisible">
        <Button
            icon="external-link-alt"
            class="justify-self-start px-4 py-2"
            variant="specialEvent"
            iconPosition="left"
            target="blank"
            href="https://www.demarches-simplifiees.fr/"
            >Faire une demande de crédits 2021</Button
        >
        <div class="justify-self-start ml-4 mt-2 italic">
            <strong>Adressez vos demandes dès maintenant</strong> et jusqu'au
            vendredi 21 mai 2021 via
            <a
                class="link"
                target="_blank"
                href="https://www.demarches-simplifiees.fr/commencer/credits-resorption-bidonvilles-2021"
                >démarches simplifiées</a
            >.
        </div>
    </div>
</template>

<script>
import { isOrgaPrefOrDdets } from "#helpers/api/config";

export default {
    data() {
        return {
            isPrefOrDdets: isOrgaPrefOrDdets()
        };
    },

    computed: {
        shouldBeVisible() {
            const deadlineDate = new Date("2021-05-22");
            return this.isPrefOrDdets === true && deadlineDate - new Date() > 0;
        }
    }
};
</script>
