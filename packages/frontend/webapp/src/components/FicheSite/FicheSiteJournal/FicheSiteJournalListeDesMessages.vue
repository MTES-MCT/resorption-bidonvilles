<template>
    <section>
        <DsfrPagination
            v-if="comments.length > itemsPerPage"
            v-model:current-page="currentPage"
            :pages="pages"
            :trunc-limit="4"
            class="mt-4"
        />
        <CarteCommentaireSite
            v-for="comment in paginatedResults"
            :key="comment.id"
            :townId="townId"
            :comment="comment"
        />
        <DsfrPagination
            v-if="comments.length > itemsPerPage"
            v-model:current-page="currentPage"
            :pages="pages"
            :trunc-limit="4"
            class="mt-4"
        />
    </section>
</template>

<script setup>
import { computed, defineProps, ref, toRefs, watch } from "vue";
import CarteCommentaireSite from "@/components/CarteCommentaire/CarteCommentaireSite.vue";

const props = defineProps({
    comments: Array,
    townId: Number,
});
const { comments, townId } = toRefs(props);
const currentPage = ref(0);
const itemsPerPage = 10;
const totalPages = computed(() => {
    return Math.ceil(comments.value.length / itemsPerPage);
});
const pages = computed(() => {
    let results = [];

    for (let i = 1; i < totalPages.value + 1; i++) {
        results.push({
            title: `${i}`,
            href: `${i}`,
            label: i,
        });
    }
    return results;
});
const paginatedResults = computed(() => {
    const start = currentPage.value * itemsPerPage;
    const end = start + itemsPerPage;

    return comments.value.slice(start, end);
});

watch(currentPage, () => {
    const element = document.getElementById("messages_du_site");
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
});
</script>
