<template>
    <div>
        <div class="font-bold">{{ title }}</div>

        <ul class="list-none">
            <li v-for="(item, index) in enrichedItems" :key="item.label">
                <FicheAccesBodyOptions
                    v-if="item.subsection && index > 0"
                    :user="user"
                    :options="options"
                    @update:options="updateOptions"
                />
                <div
                    :class="[
                        'flex items-center',
                        item.subsection && index > 0 ? 'mt-4' : '',
                    ]"
                >
                    <div class="w-6">
                        <Icon
                            :class="[
                                item.type === 'deny'
                                    ? 'text-error'
                                    : 'text-tertiary',
                            ]"
                            :icon="item.icon"
                        />
                    </div>

                    <span v-html="item.label.replace(/%(.+?)%/gi, '$1')"></span>
                </div>
                <div v-if="item.comments" class="flex items-center">
                    <div class="w-6">
                        <Icon
                            v-if="item.comments.startsWith('hors')"
                            class="text-error"
                            icon="times"
                        />
                        <Icon v-else class="text-tertiary" icon="check" />
                    </div>
                    <div>
                        {{ item.comments }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import FicheAccesBodyOptions from "./FicheAccesBodyOptions.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const TYPES_TO_ICONS = {
    view: "fa-regular fa-eye",
    edit: "pencil-alt",
    deny: "times",
};
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
});
const { title, items, options } = toRefs(props);

const enrichedItems = computed(() => {
    return items.value.reduce((acc, arr) => {
        if (arr.length > 0) {
            Object.assign(arr[0], { subsection: true });
        }

        return [...acc, ...arr.map(enrichItemWithIcon)];
    }, []);
});

function enrichItemWithIcon(item) {
    return { ...item, icon: TYPES_TO_ICONS[item.type] };
}
</script>
