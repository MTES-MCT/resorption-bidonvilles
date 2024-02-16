<template>
    <CheckableGroup id="tags" :label="labels.tags_info">
        <Checkbox
            v-for="item in items"
            :key="item.uid"
            :value="item.uid"
            :label="item.name"
            name="tags"
            v-model="values.tags"
            v-bind="$attrs"
            :disabled="disableTags"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed, toRefs, ref } from "vue";
import { useFormValues } from "vee-validate";
import { useConfigStore } from "@/stores/config.store";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";

import labels from "../FormNouvelleQuestion.labels";

const props = defineProps({
    disableTags: Boolean,
});

const { disableTags } = toRefs(props);
const topics = ref([]);
const checkedTopics = ref([]);
const configStore = useConfigStore();
configStore.config.question_tags.map((item, index) => {
    topics.value.push({ id: index + 1, ...item });
});
const items = computed(() => {
    return [
        ...topics.value,
        { id: topics.value.length + 1, uid: "other", name: "Autre" },
    ];
});

const values = useFormValues();

items.value.map((item, index) => {
    if (values.value.tags.some((el) => el.uid === item.uid)) {
        checkedTopics.value.push(index + 1);
    }
});
</script>
