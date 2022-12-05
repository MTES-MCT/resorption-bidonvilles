<template>
    <div
        v-if="towns.length > 0"
        class="whitespace-nowrap overflow-y-auto mb-8 mt-2"
    >
        <Container>
            <TownCard
                v-for="town in towns"
                :key="town.id"
                :town="town"
                @click.native="showTownPage(town)"
            ></TownCard>
        </Container>
    </div>
</template>
<script>
import Container from "#src/js/components/Container.vue";
import TownCard from "./TownCard.vue";

export default {
    props: {
        towns: {
            type: Array,
            required: true,
        },
    },

    components: { Container, TownCard },
    methods: {
        showTownPage(town) {
            this.$router.push(`/site/${town.id}`);
        },
    },
};
</script>
