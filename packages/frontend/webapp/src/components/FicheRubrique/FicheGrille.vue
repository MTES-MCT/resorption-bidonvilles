<template>
    <FicheSousRubrique>
        <div
            class="flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between"
        >
            <div><slot name="col1" /></div>
            <div class="break-words"><slot name="col2" /></div>
        </div>
    </FicheSousRubrique>
</template>

<script setup>
import FicheSousRubrique from "./FicheSousRubrique.vue";
</script>
