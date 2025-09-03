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
                    v-if="sortPriority"
                    class="text-xs bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center"
                >
                    {{ sortPriority }}
                </span>
                <Icon
                    :icon="
                        sortDirection === 'asc'
                            ? 'chevron-up'
                            : sortDirection === 'desc'
                            ? 'chevron-down'
                            : 'chevron-down'
                    "
                    :class="{
                        'text-primary': sortDirection,
                        'text-gray-300': !sortDirection,
                    }"
                />
            </div>
            <Icon icon="chevron-down" v-else-if="$slots.default" />
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import Icon from "@resorptionbidonvilles/ui";

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
    sortPriority: {
        type: Number,
        default: null,
    },
});

const emit = defineEmits(["sort"]);

const { separator, sortable, sortKey, sortDirection, sortPriority } =
    toRefs(props);

const handleSort = () => {
    if (sortable.value && sortKey.value) {
        emit("sort", sortKey.value);
    }
};
</script>
