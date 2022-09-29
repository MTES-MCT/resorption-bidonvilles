<template>
    <article>
        <header>
            <h1 class="font-bold text-primary">
                {{ comment.createdBy.first_name }}
                {{ comment.createdBy.last_name }}
            </h1>
        </header>
        <p class="whitespace-pre-wrap break-words">{{ comment.description }}</p>
        <footer class="text-sm">
            <span class="text-G500">le {{ createdAt }}</span>
        </footer>
    </article>
</template>

<script>
import formatDate from "#frontend/common/helpers/formatDate";

export default {
    props: {
        comment: {
            type: Object,
            required: true
        }
    },

    computed: {
        createdAt() {
            return formatDate(this.comment.createdAt, "d M y à h:i");
        }
    }
};
</script>
