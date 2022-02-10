<template>
    <div>
        <h1 class="text-display-lg mb-4 whitespace-nowrap">Dispositifs</h1>
        <h2 class="mb-4">
            L'ensemble des dispositifs sur votre territoire :
            <span class="font-bold">{{ location.label }}</span>
        </h2>

        <div v-if="hasPermission('plan.create')" align="right" class="mb-6">
            <router-link to="/nouveau-dispositif">
                <Button
                    icon="plus"
                    iconPosition="left"
                    variant="secondary"
                    class="whitespace-no-wrap"
                >
                    Déclarer un nouveau dispositif</Button
                >
            </router-link>
        </div>
    </div>
</template>

<script>
import { hasPermission } from "#helpers/api/config";
import { mapGetters } from "vuex";

export default {
    methods: {
        hasPermission(...args) {
            return hasPermission(...args);
        }
    },

    computed: {
        ...mapGetters({
            location: "plansLocationFilter"
        })
    }
};
</script>
