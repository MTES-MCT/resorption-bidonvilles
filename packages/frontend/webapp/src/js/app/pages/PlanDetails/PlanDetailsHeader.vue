<template>
    <div>
        <div class="text-display-lg font-bold">
            {{ plan.name }}
        </div>
        <div class="flex items-center">
            <div
                v-if="plan.closed_at !== null"
                class="flex items-center uppercase text-sm mr-4"
            >
                <div class="rounded-full bg-red h-3 w-3 mr-2 " />
                Fermé le
                {{ formatDate(plan.closed_at / 1000, "d/m/y") }}
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
        <div class="flex justify-end mt-2 mb-2">
            <Button
                v-if="plan.canClose === true && plan.closed_at === null"
                variant="primaryOutline"
                class="ml-8"
                @click="$emit('closePlan')"
                >Fermer l'action</Button
            >
            <Tooltip
                text="Accessible uniquement aux pilotes de cette action"
                :disabled="plan.canUpdate === true"
            >
                <Button
                    variant="primary"
                    class="ml-8"
                    icon="pen"
                    iconPosition="left"
                    v-if="
                        (plan.canUpdate === true ||
                            plan.canUpdateMarks === true) &&
                            plan.closed_at === null
                    "
                    :disabled="plan.canUpdate !== true"
                    @click="routeToUpdate"
                    >Mettre à jour</Button
                >
            </Tooltip>
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
export default {
    props: {
        plan: {
            type: Object
        }
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        },
        routeToUpdate() {
            this.$router.push(`/modifier-action/${this.plan.id}/`);
        },
        routeToUpdateMarks() {
            this.$router.push(`/action/${this.plan.id}/indicateurs`);
        }
    }
};
</script>
