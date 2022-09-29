<template>
    <article>
        <header>
            <span class="text-G500">{{ createdAt }}</span>
            <h1 class="font-bold text-primary">
                {{ comment.createdBy.first_name }}
                {{ comment.createdBy.last_name }}
            </h1>
        </header>
        {{ comment.description }}
    </article>
</template>

<script>
export default {
    props: {
        comment: {
            type: Object,
            required: true
        }
    },

    computed: {
        createdAt() {
            return new Date(this.comment.createdAt * 1000).toLocaleDateString();
        }
    }
};
</script>
