<template>
    <DetailsPanel>
        <template v-slot:title>Financements</template>
        <template v-slot:body>
            <Finances :finances="plan.finances" />
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import Finances from "#app/components/Finances/Finances.vue";

export default {
    props: {
        plan: {
            type: Object
        }
    },

    components: {
        DetailsPanel,
        Finances
    }
};
</script>
