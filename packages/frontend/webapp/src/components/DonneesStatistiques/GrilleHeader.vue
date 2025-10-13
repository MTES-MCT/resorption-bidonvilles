<template>
    <div
        class="border-t border-b flex items-stretch justify-end py-3 cursor-pointer hover:bg-G100"
        @click="handleSort"
    >
        <div
            class="flex space-x-2 px-3 items-end"
            :class="separator ? 'border-r' : ''"
        >
            <p><slot /></p>
            <div class="flex items-center space-x-1" v-if="sortable">
                <span
                    :class="
                        sortDirection === 'asc'
                            ? 'fr-icon-arrow-up-s-line'
                            : sortDirection === 'desc'
                            ? 'fr-icon-arrow-down-s-line'
                            : 'fr-icon-arrow-down-s-line text-gray-300'
                    "
                ></span>
            </div>
            <span
                class="fr-icon-arrow-down-s-line"
                v-else-if="$slots.default"
            ></span>
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    separator: {
        type: Boolean,
        default: true,
    },
    sortable: {
        type: Boolean,
        default: false,
    },
    sortKey: {
        type: String,
        default: null,
    },
    sortDirection: {
        type: String,
        default: null, // null, 'asc', 'desc'
    },
});

const emit = defineEmits(["sort"]);

const { separator, sortable, sortKey, sortDirection } = toRefs(props);

const handleSort = () => {
    if (sortable.value && sortKey.value) {
        emit("sort", sortKey.value);
    }
};
</script>
