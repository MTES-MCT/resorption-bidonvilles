<template>
    <div class="flex flex-col xs:flex-row items-center">
        <Button icon="chevron-left" iconPosition="left" variant="custom" size="custom"
            class="hover:bg-G200 rounded-full px-4 py-1 mx-2" :disabled="currentPage === 1"
            @click="onPrevious" type="button">Précédent</Button>

        <component :is="currentPage > 1 ? 'button' : 'div'" class="h-8 w-8 flex justify-center items-center rounded-full "
            :class="currentPage > 1 ? 'hover:bg-G200 cursor-pointer' : ''" @click="setPage(1)">
            <span v-if="currentPage > 1">1</span>
            <span class="opacity-85" v-else>—</span>
        </component>
        <div class="h-8 w-8 bg-primary text-white flex justify-center items-center rounded-full mx-4">
            {{ currentPage }}
        </div>
        <component :is="currentPage !== nbPages ? 'button' : 'div'" class="h-8 w-8 flex justify-center items-center rounded-full hover:!bg-G200"
            :class="currentPage !== nbPages ? 'hover:bg-G200 cursor-pointer' : ''" @click="setPage(nbPages)">
            <span v-if="currentPage !== nbPages">{{ nbPages }}</span>
            <span class="opacity-85" v-else>—</span>
        </component>

        <Button icon="chevron-right" iconPosition="right" variant="custom" size="custom"
            :disabled="currentPage === nbPages" class="hover:!bg-G200 rounded-full px-4 py-1 mx-2"
            @click="onNext" type="button">Suivant</Button>
    </div>
</template>

<script setup>
import { defineProps, toRefs, defineEmits, nextTick } from "vue";
import Button from "./Button.vue";

const props = defineProps({
    currentPage: {
        type: Number,
    },
    nbPages: {
        type: Number,
    },
    autoScrollFix: {
        type: Boolean,
        default: false
    },
});
const emit = defineEmits(["pagechange"]);
const { currentPage, nbPages, autoScrollFix } = toRefs(props);

function onPrevious() {
    setPage(Math.max(1, currentPage.value - 1));
}

function onNext() {
    setPage(Math.min(currentPage.value + 1, nbPages.value));
}

function setPage(page) {
    const heightBeforeChange = document.body.scrollHeight;
    const scrollYBeforeChange = window.scrollY;
    emit("pagechange", page);

    if (autoScrollFix.value === true) {
        nextTick(() => {
            const heightDiff = document.body.scrollHeight - heightBeforeChange;
            window.scrollTo(0, scrollYBeforeChange + heightDiff);
        });
    }
}
</script>
