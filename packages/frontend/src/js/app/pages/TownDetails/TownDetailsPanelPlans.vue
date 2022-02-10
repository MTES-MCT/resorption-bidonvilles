<template>
    <DetailsPanel>
        <template v-slot:title>Dispositifs</template>
        <template v-slot:body>
            <DetailsPanelSection v-for="plan in town.plans" :key="plan.plan_id">
                <div class="flex">
                    <div class="w-2/3">
                        <div class="font-bold mb-2">
                            Dispositif « {{ plan.name }} »
                        </div>
                        <Tag
                            v-for="(topic, index) in plan.topics"
                            :key="index"
                            class="mr-2 mb-2"
                            variant="primary"
                            >{{ topic }}</Tag
                        >
                        <div class="font-bold">
                            Mené par
                            <router-link
                                class="link"
                                :to="'/annuaire/' + plan.operator.id"
                                >{{
                                    plan.operator.abbreviation ||
                                        plan.operator.name
                                }}</router-link
                            >
                        </div>
                    </div>
                    <div class="w-1/3">
                        <Button
                            variant="primaryText"
                            :href="'/dispositif/' + plan.plan_id"
                            >Voir les résultats de ce dispositif</Button
                        >
                    </div>
                </div>
            </DetailsPanelSection>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import DetailsPanelSection from "#app/components/ui/details/DetailsPanelSection.vue";

export default {
    components: { DetailsPanel, DetailsPanelSection },

    props: {
        town: {
            type: Object
        }
    }
};
</script>
