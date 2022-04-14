<template>
    <div class="text-sm mb-4 max-w-lg" v-if="nearbyClosedShantytowns.length">
        <span v-if="nearbyClosedShantytowns.length === 1"
            >1 site a été fermé</span
        >
        <span v-else
            >{{ nearbyClosedShantytowns.length }} sites ont été fermés
        </span>
        <span>
            dans un rayon de 500 mètres autour de cette adresse. Si la
            déclaration actuelle correspond à la réouverture de l'un de ces
            sites, merci de le préciser en cochant la case 'Oui'
        </span>
        <ul class="list-disc ml-4">
            <li :key="town.id" v-for="town in displayClosedShantytowns">
                <router-link class="link" :to="`/site/${town.id}`">
                    {{ town.usename }}
                    <span> ({{ town.distance.toFixed(2) }}km)</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        nearbyClosedShantytowns: {
            type: Array
        }
    },

    computed: {
        displayClosedShantytowns() {
            return this.nearbyClosedShantytowns.slice(0, 5);
        }
    }
};
</script>
