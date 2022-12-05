<template>
    <article>
        <section>
            <p class="font-bold truncate text-G500 text-lg">{{ title }}</p>
            <p class="truncate">{{ description }}</p>
        </section>
        <footer class="text-sm mt-1 flex space-x-3">
            <p><Icon icon="pen" class="mr-1" />Créée le {{ createdAt }}</p>
            <p :class="publishedColor">
                <Icon icon="paper-plane" class="mr-1" />
                <span v-if="note.publications.length > 0"
                    >Publiée le {{ publishedAt }}</span
                >
                <span v-else>Non publiée</span>
            </p>
        </footer>
    </article>
</template>

<script>
import formatDate from "#frontend/common/helpers/formatDate";
import { Icon } from "@resorptionbidonvilles/ui";

export default {
    components: { Icon },
    props: {
        note: {
            type: Object,
            required: true,
        },
    },
    computed: {
        rawDescription() {
            return this.note.description.replace(/^\s+|\s+$/g, "");
        },
        title() {
            if (!this.rawDescription) {
                return "Note sans titre";
            }

            return this.rawDescription.split("\n")[0];
        },
        description() {
            if (!this.rawDescription) {
                return "Note sans description";
            }

            return this.rawDescription
                .split("\n")
                .slice(1)
                .join("\n")
                .replace(/^\s+|\s+$/g, "");
        },
        publishedColor() {
            return this.note.publications.length > 0
                ? "text-green"
                : "text-red";
        },
        createdAt() {
            return formatDate(new Date(this.note.created_at).getTime() / 1000);
        },
        publishedAt() {
            if (this.note.publications.length === 0) {
                return null;
            }

            return formatDate(
                new Date(
                    this.note.publications.slice(-1)[0].published_at
                ).getTime() / 1000
            );
        },
    },
};
</script>
