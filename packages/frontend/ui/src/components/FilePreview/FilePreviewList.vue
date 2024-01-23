<template>
    <div class="border bg-white p-2">
        <p class="text-sm font-bold">
            <template v-if="files.length === 0">
                <Icon icon="paperclip" /> Aucune pièce-jointe
            </template>
            <template v-else>
                <Link @click="toggle" variant="text" :padding="false" size="sm">
                <Icon icon="paperclip" /> {{ isCollapsed ? 'Masquer' : 'Voir' }} {{ title }}
                <Icon :icon="isCollapsed ? 'chevron-up' : 'chevron-down'" class="ml-1" />
                </Link>
            </template>
        </p>
        <FilePreviewGrid
            v-if="isCollapsed"
            :files="files"
            :allowDeletion="allowDeletion"
            @deleteFile="(file, index) => emit('deleteFile', file, index)"
        />
    </div>
</template>

<script setup>
import { ref, toRefs, computed } from 'vue';
import FilePreviewGrid from "./FilePreviewGrid.vue";
import Icon from "../Icon.vue";
import Link from "../Link.vue";

const props = defineProps({
    files: {
        type: Array,
        default() {
            return [];
        },
    },
    collapsedByDefault: {
        type: Boolean,
        required: false,
        default: true,
    },
    allowDeletion: {
        type: Boolean,
        default: false,
    },
});
const { files, collapsedByDefault, allowDeletion } = toRefs(props);
const isCollapsed = ref(collapsedByDefault.value);
const emit = defineEmits(["deleteFile"]);

const title = computed(() => {
    if (files.value.length === 1) {
        return 'la pièce jointe';
    }

    return `les ${files.value.length} pièces-jointes`;
});

function toggle() {
    isCollapsed.value = !isCollapsed.value;
}
</script>