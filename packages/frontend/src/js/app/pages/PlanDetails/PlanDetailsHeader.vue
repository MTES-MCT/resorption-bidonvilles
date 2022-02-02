<template>
    <div>
        <div class="text-display-lg">
            {{ plan.name }}
        </div>
        <div class="flex items-center">
            <div
                v-if="plan.closed_at !== null"
                class="flex items-center uppercase text-sm mr-4"
            >
                Fermé le
                {{ formatDate(plan.closed_at, "d/m/y") }}
            </div>
            <div
                class="flex items-center uppercase text-sm mr-4"
                v-if="!plan.updated_at"
            >
                <div class="rounded-full bg-corail h-3 w-3 mr-2 " />
                Déclaré le
                {{ formatDate(plan.created_at / 1000, "d/m/y") }}
            </div>
            <div class="flex items-center uppercase text-sm mr-4" v-else>
                <div class="rounded-full bg-corail h-3 w-3 mr-2 " />
                Mis à jour le
                {{ formatDate(plan.updated_at / 1000, "d/m/y") }}
            </div>
        </div>
        <div class="flex justify-end mt-2">
            <Button
                v-if="plan.canClose === true && plan.closed_at === null"
                variant="primaryOutline"
                class="ml-8"
                @click="$emit('closePlan')"
                >Fermer le dispositif</Button
            >
            <Button
                variant="primary"
                class="ml-8"
                icon="pen"
                iconPosition="left"
                v-if="plan.canUpdate === true && plan.closed_at === null"
                @click="routeToUpdate"
                >Mettre à jour</Button
            >
            <Button
                variant="primary"
                class="ml-8"
                icon="pen"
                iconPosition="left"
                v-if="plan.canUpdateMarks === true && plan.closed_at === null"
                @click="routeToUpdateMarks"
                >Mettre à jour les indicateurs</Button
            >
        </div>
    </div>
</template>

<script>
import { get as getConfig } from "#helpers/api/config";

export default {
    props: {
        plan: {
            type: Object
        }
    },
    data() {
        const { user } = getConfig();
        return {
            user
        };
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        },
        routeToUpdate() {
            this.$router.push(`/modifier-dispositif/${this.plan.id}/`);
        },
        routeToUpdateMarks() {
            this.$router.push(`/dispositif/${this.plan.id}/indicateurs`);
        }
    }
};
</script>
