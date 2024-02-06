<template>
    <div class="border rounded p-4 -mt-4 flex flex-wrap gap-2 mb-6">
        <p v-if="tags.length === 0" class="text-G700 italic">
            La liste est vide pour le moment
        </p>
        <template v-else>
            <Tag v-for="tag in tags" :key="tag.id"
                :onDelete="onDelete && !disabled ? () => onDelete(tag.id) : undefined">
                {{ tag.label }}
            </Tag>
        </template>
    </div>
</template>

<script>
import Tag from "./Tag.vue";

export default {
    components: {
        Tag
    },
    props: {
        tags: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },
        onDelete: {
            type: Function,
            required: false
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    }
};
</script>