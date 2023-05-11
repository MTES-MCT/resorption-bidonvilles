<template>
    <div class="border bg-white p-2">
        <p class="text-sm font-bold">
            <template v-if="files.length === 0">
                <Icon icon="paperclip" /> Aucune pièce-jointe
            </template>
            <template v-else-if="!collapse">
                <Icon icon="paperclip" /> {{ title }}
            </template>
            <template v-else>
                <Link @click="toggle" variant="text" :padding="false" size="sm">
                <Icon icon="paperclip" /> {{ isCollapsed ? 'Masquer les' : 'Voir les' }} {{ title }}
                <Icon :icon="isCollapsed ? 'chevron-up' : 'chevron-down'" class="ml-1" />
                </Link>
            </template>
        </p>
        <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-1" v-if="!collapse || isCollapsed">
            <FilePreview v-for="file in files" :key="file.id" :file="file" />
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, computed } from 'vue';
import FilePreview from "./FilePreview.vue";
import Icon from "../Icon.vue";
import Link from "../Link.vue";

const props = defineProps({
    files: {
        type: Array,
        default() {
            return [];
        },
    },
    collapse: {
        type: Boolean,
        default: true,
    },
});
const { files, collapse } = toRefs(props);
const isCollapsed = ref(false);

const title = computed(() => {
    return `${files.value.length} pièce${files.value.length > 1 ? "s" : ""} jointe${files.value.length > 1 ? "s" : ""
        }`;
});

function toggle() {
    isCollapsed.value = !isCollapsed.value;
}
</script>