<template>
    <section class="mb-4">
        <h1 class="font-bold text-lg">{{ title }}</h1>
        <ul class="mt-1 flex flex-col space-y-3" v-if="items.length > 0">
            <SearchItem v-for="item in items" :key="item.id" :item="item" />
        </ul>
        <p v-else class="text-G500">
            Aucun site trouvé
        </p>
    </section>
</template>

<script>
import SearchItem from "./SearchItem.vue";

export default {
    components: {
        SearchItem
    },
    props: {
        title: {
            type: String,
            required: true
        },
        items: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        }
    }
};
</script>
