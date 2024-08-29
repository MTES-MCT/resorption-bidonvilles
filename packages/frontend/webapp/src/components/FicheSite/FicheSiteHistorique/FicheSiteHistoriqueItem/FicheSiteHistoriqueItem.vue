<template>
    <section class="py-4 border-b border-b-G400">
        <LinkOrganization :to="`/structure/${author.organization.id}`">
            {{ author.first_name }}
            {{ author.last_name }} -
            {{ author.organization.abbreviation || author.organization.name }}
        </LinkOrganization>
        <p class="text-sm text-G700">
            le {{ formatDate(date, "d M y à h:i") }}
        </p>

        <div class="my-2 flex flex-col space-y-2">
            <p v-if="$slots.default" class="text-green700"><slot /></p>

            <article v-else v-for="item in diff" :key="item.field">
                <p class="text-green700">{{ item.field }}</p>
                <p
                    v-if="item.fieldKey !== 'updatedWithoutAnyChange'"
                    class="break-words whitespace-pre-wrap"
                >
                    <span> {{ item.newValue || "non renseigné" }}, </span>
                    <span class="line-through text-G700 hover:text-G700">{{
                        item.oldValue || "non renseigné"
                    }}</span>
                </p>
            </article>
        </div>
    </section>
</template>

<script setup>
import { toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";
import { LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    author: Object,
    date: [String, Number],
    diff: {
        type: Array,
        required: false,
        default() {
            return [];
        },
    },
});
const { author, date, diff } = toRefs(props);
</script>
