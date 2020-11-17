<template>
    <div>
        <div class="flex justify-end mb-6">
            <Button variant="primaryOutline" class="mr-8"
                >Fermer le site</Button
            >
            <Button variant="primary" class="mr-8"
                >Ecrire un commentaire</Button
            >
            <Button variant="secondary" class="mr-8">Mettre a jour</Button>
        </div>
        <div>
            <div>{{ town.city.name }} ({{ town.departement.name }})</div>
            <div class="text-display-lg">
                {{ town.addressSimple }}
                <span v-if="town.name">« {{ town.name }} »</span>
            </div>
        </div>
        <div class="flex items-center">
            <div class="flex items-center">
                <div class="rounded-full bg-corail h-3 w-3 mr-2" />
                Mis à jour le
                {{ formatDate(town.updatedAt, "d/m/y") }}
            </div>
            <div class="text-red ml-6">
                0 commentaires
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
