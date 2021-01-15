<template>
    <div>
        <div class="flex justify-end mb-6">
            <Button
                variant="primaryOutline"
                class="mr-8"
                iconPosition="left"
                @click="$emit('openCancel')"
                v-if="town.status === 'open'"
                >Fermer le site</Button
            >
            <router-link to="#newComment">
                <Button
                    variant="secondary"
                    class="mr-8"
                    icon="comment"
                    iconPosition="left"
                    >Journal du site</Button
                >
            </router-link>

            <Button
                variant="primary"
                class="mr-8"
                icon="pen"
                iconPosition="left"
                v-if="town.status === 'open'"
                >Mettre a jour</Button
            >
        </div>
        <div>
            <div>{{ town.city.name }} ({{ town.departement.name }})</div>
            <div class="text-display-lg">
                {{ town.addressSimple }}
                <span v-if="town.name" class="text-display-xs"
                    >« {{ town.name }} »</span
                >
            </div>
        </div>
        <div class="flex items-center">
            <div class="flex items-center uppercase text-sm mr-4">
                <div class="rounded-full bg-corail h-3 w-3 mr-2 " />
                Mis à jour le
                {{ formatDate(town.updatedAt, "d/m/y") }}
            </div>
            <div
                class="flex items-center text-red uppercase text-xs font-bold cursor-pointer"
                @click="$emit('openCovid')"
            >
                <Icon icon="comment" class="mr-2" />
                <div>
                    {{ this.town.comments.covid.length || 0 }} commentaires
                    covid
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        town: {
            type: Object
        }
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        }
    }
};
</script>
