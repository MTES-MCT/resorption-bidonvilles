<template>
    <div
        ref="bar"
        class="rounded-sm w-2 mr-1 cursor-pointer"
        :class="hover ? hoverColor : color"
        @mouseover="hover = true"
        @mouseleave="hover = false"
    ></div>
</template>

<script>
export default {
    data() {
        return {
            hover: false
        };
    },
    props: {
        height: {
            type: Number
        },
        color: {
            type: String
        },
        hoverColor: {
            type: String
        }
    },

    mounted() {
        // Si un chiffre est égal à 0 on affiche quand même une barre à 2 px de hauteur
        this.$refs.bar.style.height =
            this.height !== 0 ? `${this.height}px` : "2px";
    }
};
</script>
