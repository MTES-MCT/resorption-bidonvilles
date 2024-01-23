<template>
    <div
        class="relative"
        @dragenter.prevent="handleDragEnter"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @dragover.prevent="handleDragOver"
    >
        <slot />

        <div class="hidden absolute h-full w-full top-0 left-0" ref="dropZone">
            <div
                class="absolute h-full w-full bg-blue200 border-4 border-blue400 opacity-80"
            ></div>
            <div
                class="absolute h-full w-full flex items-center justify-center font-bold text-xl"
            >
                Faites glisser des fichiers pour les ajouter
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

let counter = 0;
const dropZone = ref(null);
const emit = defineEmits(["drop"]);

function hideDropZone() {
    dropZone.value.classList.add("hidden");
}

function handleDragEnter() {
    if (counter === 0) {
        dropZone.value.classList.remove("hidden");
    }
    counter += 1;
}

function handleDragLeave() {
    counter -= 1;
    if (counter === 0) {
        hideDropZone();
    }
}

function handleDrop(event) {
    event.preventDefault();
    counter = 0;
    hideDropZone();

    emit("drop", event.dataTransfer.files);
}

function handleDragOver(event) {
    event.preventDefault();
}
</script>
