<template>
    <div ref="bar" class="rounded-sm w-2 mr-1"></div>
</template>

<script>
export default {
    props: {
        height: {
            type: Number
        }
    },
    mounted() {
        // Si un chiffre est égal à 0 on affiche quand même une barre à 2 px de hauteur
        this.$refs.bar.style.height =
            this.height !== 0 ? `${this.height}px` : "2px";
    }
};
</script>
