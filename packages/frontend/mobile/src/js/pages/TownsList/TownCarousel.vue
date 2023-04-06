<template>
    <div v-if="towns.length > 0" class="whitespace-nowrap overflow-y-auto mt-2">
        <Container>
            <TownCard
                v-for="town in towns"
                :key="town.id"
                :town="town"
                @click="showTownPage(town)"
            ></TownCard>
        </Container>
    </div>
</template>
<script>
import Container from "#src/js/components/Container.vue";
import routeToTown from "#src/js/utils/routeToTown";
import TownCard from "./TownCard.vue";

export default {
    props: {
        id: {
            type: String,
            required: true,
        },
        towns: {
            type: Array,
            required: true,
        },
    },

    components: { Container, TownCard },
    methods: {
        showTownPage(town) {
            routeToTown(town.id, this.id);
        },
    },
};
</script>
