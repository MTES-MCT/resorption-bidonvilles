<template>
    <div>
        <div class="flex justify-evenly text-center py-4">
            <div
                v-for="item in items"
                :key="item.id"
                @click="changeFilter(item.id)"
                :class="[
                    'flex-1 py-2 my-2',
                    status[item.id].length === 0 ? 'bg-G400' : '',
                    select === item.id
                        ? 'text-primary border-b border-b-blue'
                        : ''
                ]"
            >
                <Icon :class="'mr-1'" :icon="icon(item.id)" />
                {{ item.label }}
            </div>
        </div>

        <div class="border-G200 py-2" v-if="select !== null">
            <ul class="list-disc ml-10">
                <li v-for="(item, index) in status[select]" :key="index">
                    {{ item.text }}
                    <span class="italic">{{
                        item.info ? `- ${item.info}` : ""
                    }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.border-b-blue {
    border-bottom-color: blue;
}
</style>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

export default {
    props: {
        status: {
            type: Object
        }
    },
    data() {
        return {
            select: null,
            items: [
                { id: "positive", label: "À entretenir" },
                {
                    id: "negative",
                    label: "À améliorer"
                },
                { id: "unknown", label: "À renseigner" }
            ]
        };
    },
    components: {
        Icon
    },
    methods: {
        changeFilter(value) {
            if (this.status[value].length !== 0) {
                this.select = value;
            }
        },
        icon(value) {
            return {
                positive: "check",
                negative: "exclamation-triangle",
                unknown: "question"
            }[value];
        }
    }
};
</script>
