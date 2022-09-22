<template>
    <article>
        <section>
            <p class="font-bold truncate text-G500 text-lg">
                <span v-if="note.title">{{ note.title }}</span>
                <span v-else>Note sans titre</span>
            </p>
            <p class="truncate">
                <span v-if="note.description">{{ note.description }}</span>
                <span v-else>Cette note ne contient aucun contenu</span>
            </p>
        </section>
        <footer class="text-sm mt-1 flex space-x-3">
            <p><Icon icon="pen" class="mr-1" />Créée le {{ createdAt }}</p>
            <p :class="publishedColor">
                <Icon icon="paper-plane" class="mr-1" />
                <span v-if="note.published">Publiée</span>
                <span v-else>Non publiée</span>
            </p>
        </footer>
    </article>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

export default {
    components: { Icon },
    props: {
        note: {
            type: Object,
            required: true
        }
    },
    computed: {
        publishedColor() {
            return this.note.published ? "text-green" : "text-red";
        },
        createdAt() {
            return `${this.note.created_at.getDate()}/${this.note.created_at.getMonth() +
                1}/${this.note.created_at.getFullYear()}`;
        }
    }
};
</script>
