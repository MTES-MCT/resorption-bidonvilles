<template>
    <div>
        <h1 class="text-display-lg mb-4 whitespace-nowrap">Dispositifs</h1>
        <h2 class="mb-4">
            L'ensemble des dispositifs sur votre territoire :
            <span class="font-bold">{{ locationTitle }}</span>
        </h2>

        <div v-if="hasPermission('plan.create')" align="right">
            <router-link to="/nouveau-dispositif" align="right">
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

export default {
    props: {
        locationTitle: {
            type: String
        }
    },

    methods: {
        hasPermission(...args) {
            return hasPermission(...args);
        }
    }
};
</script>
