<template>
    <div class="border-b-2 border-G200 py-2" v-if="details.length">
        <div class="flex items-center">
            <Icon
                :class="['mr-1', 'mb-1', 'font-bold', 'text-G600']"
                :icon="icon"
            />
            <div class="font-bold">
                {{ wording }}
            </div>
        </div>

        <ul class="list-disc ml-10" :data-cy-data="cypressName">
            <li v-for="(item, index) in details" :key="index">
                {{ item.text }}
                <span class="italic">{{
                    item.info ? `- ${item.info}` : ""
                }}</span>
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
    },
    computed: {
        icon() {
            return {
                positive: "check",
                negative: "exclamation-triangle",
                unknown: "question"
            }[this.type];
        },
        wording() {
            return {
                positive: "À entretenir",
                negative: "À améliorer",
                unknown: "Non renseigné"
            }[this.type];
        }
    }
};
</script>
