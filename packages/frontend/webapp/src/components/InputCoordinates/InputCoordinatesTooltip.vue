<template>
    <div :class="isVisible ? 'block' : 'hidden'">
        <div
            class="absolute w-full h-full opacity-85 bg-black"
            style="z-index: 1001"
        ></div>
        <div class="absolute w-full" style="z-index: 1002">
            <div class="mx-auto mt-8 w-8/12 text-sm bg-white p-3">
                <p>
                    Si besoin, préciser la localisation en déplaçant le pointeur
                    sur la carte.
                </p>
                <p
                    class="font-bold text-right cursor-pointer text-primary"
                    @click="hide"
                >
                    J'ai compris
                </p>
            </div>
            <div class="arrow mx-auto"></div>
        </div>
    </div>
</template>

<style scoped>
.arrow {
    display: block;
    height: 0;
    width: 0;
    border-top: 14px solid white;
    border-right: 8px solid transparent;
    border-left: 7px solid transparent;
}
</style>

<script setup>
import { ref } from "vue";
const isVisible = ref(true);

function hide() {
    isVisible.value = false;
}
</script>
