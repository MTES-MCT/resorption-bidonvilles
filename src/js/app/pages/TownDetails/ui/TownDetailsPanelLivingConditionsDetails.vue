<template>
    <div class="border-b-2 border-G200 py-2" v-if="details.length">
        <div class="flex items-center">
            <Icon
                :class="['mr-1', 'mb-1', 'font-bold', 'text-G600']"
                :icon="type === 'positive' ? 'check' : 'exclamation-triangle'"
            />
            <div class="font-bold">
                {{ type === "positive" ? "À entretenir" : "À améliorer" }}
            </div>
        </div>

        <ul class="list-disc ml-10" :data-cy-data="cypressName">
            <li v-for="(item, index) in details" :key="index">
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String
        },
        details: {
            type: Array
        },
        cypressName: {
            type: String
        }
    }
};
</script>
