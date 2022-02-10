<template>
    <DetailsPanel>
        <template v-slot:title>Indicateurs de suivi</template>
        <template v-slot:body>
            <p class="text-center font-bold">
                Il n'y a aucun indicateur de suivi renseigné par l'opérateur
                pour le moment.
            </p>
            <p class="text-center mt-4">
                <Button
                    variant="primary"
                    class="ml-8"
                    icon="pen"
                    iconPosition="left"
                    @click="routeToUpdateMarks"
                    :withoutMargin="true"
                    >Mettre à jour les indicateurs</Button
                >
            </p>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";

export default {
    props: {
        planId: {
            type: Number,
            required: true
        }
    },
    components: {
        DetailsPanel
    },
    methods: {
        routeToUpdateMarks() {
            this.$router.push(`/dispositif/${this.planId}/indicateurs`);
        }
    }
};
</script>
