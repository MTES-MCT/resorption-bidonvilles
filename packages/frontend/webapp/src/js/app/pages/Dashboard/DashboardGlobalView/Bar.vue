<template>
    <div
        ref="bar"
        class="rounded-sm w-2 mr-1 cursor-pointer"
        :class="hover ? stat.hoverColor : stat.color"
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
        stat: {
            type: Object
        }
    },

    watch: {
        hover() {
            this.$emit("hover", {
                ...this.stat,
                show: this.hover
            });
        }
    },
    mounted() {
        // Si un chiffre est égal à 0 on affiche quand même une barre à 2 px de hauteur
        this.$refs.bar.style.height =
            this.stat.height !== 0 ? `${this.stat.height}px` : "2px";
    }
};
</script>
