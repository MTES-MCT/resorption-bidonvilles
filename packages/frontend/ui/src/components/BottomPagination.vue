<template>
    <div>
        <p class="text-right text-sm text-G500 mt-1">
            Vous consultez actuellement les lignes
            {{ from }} à
            {{ to }} sur
            <span class="font-bold">{{ total }} résultats</span>
        </p>
        <div class="flex justify-center mt-4">
            <Pagination class="mx-auto" :currentPage="currentPage" :nbPages="numberOfPages" autoScrollFix
                @pagechange="onPageChange" />
        </div>
    </div>
</template>
x
<script setup>
import { defineProps, toRefs, defineEmits } from "vue";
import Pagination from "./Pagination.vue";

const props = defineProps({
    from: {
        type: Number,
    },
    to: {
        type: Number,
    },
    total: {
        type: Number,
    },
    currentPage: {
        type: Number,
    },
    numberOfPages: {
        type: Number,
    },
});
const { from, to, total, currentPage, numberOfPages } = toRefs(props);
const emit = defineEmits(['pagechange']);

function onPageChange(...args) {
    emit('pagechange', ...args);
}
</script>
