<template>
    <div class="border-t border-G400 py-4">
        <div class="text-G600 text-sm mb-1">
            {{ formatDate(comment.createdAt, "d M y à h:i") }}
        </div>
        <div v-if="comment.private" class="font-bold">
            <Icon icon="lock" class="text-red" />
            Message réservé aux membres de la préfecture et DDCS de votre
            territoire.
        </div>
        <div class="text-primary font-bold mb-1">
            <Icon icon="user" /> {{ comment.createdBy.firstName }}
            {{ comment.createdBy.lastName }} -
            {{ comment.createdBy.organization }}
        </div>
        <div class="ml-5">{{ comment.description }}</div>
    </div>
</template>

<script>
export default {
    props: {
        comment: {
            type: Object
        }
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        }
    }
};
</script>
