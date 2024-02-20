<template>
    <section>
        <div class="z-10 grid grid-template text-sm bg-white sticky top-0">
            <GrilleHeader :separator="false" />
            <GrilleHeader
                >Sites avec accès à l'eau<br />(nbre hab.
                couverts)</GrilleHeader
            >
            <GrilleHeader>Habitants</GrilleHeader>
            <GrilleHeader :separator="false">Nombre de sites</GrilleHeader>
        </div>

        <GrilleLigne
            v-for="(m, index) in metrics"
            :key="m.uid"
            variant="primary"
            :class="index === 0 ? 'mt-4' : 'mt-2'"
            :metrics="m"
            :collapseByDefault="collapseByDefault"
        />
    </section>
</template>

<style scoped lang="scss" src="./grid.scss" />

<script>
export default {
    name: "RbGrille",
};
</script>

<script setup>
import { toRefs } from "vue";
import GrilleHeader from "./GrilleHeader.vue";
import GrilleLigne from "./GrilleLigne.vue";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
    collapseByDefault: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { metrics, collapseByDefault } = toRefs(props);
</script>
