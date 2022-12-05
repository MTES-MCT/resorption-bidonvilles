<template>
    <article>
        <header>
            <h1 class="font-bold text-primary">
                {{ comment.createdBy.first_name }}
                {{ comment.createdBy.last_name }}
            </h1>
        </header>
        <p v-if="tags.length" class="flex flex-wrap">
            <Tag
                v-for="tag in tags"
                :key="tag.uid"
                :variant="tag.variant"
                :uppercase="false"
                class="mr-1 mb-1"
                >{{ tag.label }}</Tag
            >
        </p>
        <p class="whitespace-pre-wrap break-words">{{ comment.description }}</p>
        <footer class="text-sm">
            <span class="text-G500">le {{ createdAt }}</span>
        </footer>
    </article>
</template>

<script>
import { Tag } from "@resorptionbidonvilles/ui";
import formatDate from "#frontend/common/helpers/formatDate";

export default {
    components: {
        Tag,
    },

    props: {
        comment: {
            type: Object,
            required: true,
        },
    },

    computed: {
        createdAt() {
            return formatDate(this.comment.createdAt, "d M y à h:i");
        },

        tags() {
            const tags = this.comment.tags.map((tag) => ({
                variant: "pin",
                ...tag,
            }));
            if (this.comment.covid) {
                tags.push({
                    variant: "pin_red",
                    uid: "covid",
                    label: "COVID-19",
                });
            }

            return tags;
        },
    },
};
</script>
