<template>
    <div>
        <Tab 
            v-for="tab in tabs" 
            :key="tab.id" 
            :active="activeTab === tab.id" 
            @click="onTabClick(tab.id)"
        >
            <template v-if="tab.id === 'inProgress'" v-slot:ofwhich>dont</template>
            <template v-if="tab.total !== undefined" v-slot:prefix>
                {{ formatStat(tab.total) }}
            </template>
            {{ tab.label }}
        </Tab>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Tab from "./Tab.vue"
import formatStat from "../../../../webapp/src/utils/formatStat"; 

const props = defineProps({
    tabs: {
        type: Array,
        required: true
    },
    modelValue: {
        type: [String, Number],
        required: false
    }
});

const emit = defineEmits(['update:modelValue'])

const defaultActiveTab = computed(() => 
    props.tabs.length > 0 ? props.tabs[0].id : undefined
)

const activeTab = ref(props.modelValue !== undefined ? props.modelValue : defaultActiveTab.value)

watch(() => props.modelValue, (newValue) => {
    activeTab.value = newValue
})

watch(() => props.tabs, () => {
    if (!props.tabs.some(({ id }) => id === activeTab.value)) {
        activeTab.value = props.tabs.length > 0 ? props.tabs[0].id : undefined
    }
}, { deep: true })

const onTabClick = (id) => {
    activeTab.value = id
    emit('update:modelValue', id)
}
</script>