<template>
    <div class="border-t-1 border-G400 py-4">
        <div class="flex justify-between">
            <div class="text-G600 text-sm mb-1">
                {{ formatDate(comment.createdAt, "d M y à h:i") }}
            </div>
        </div>

        <div class="text-primary font-bold mb-1 mt-2">
            <router-link :to="`/annuaire/${comment.createdBy.organization_id}`">
                <Icon icon="user" /> {{ comment.createdBy.first_name }}
                {{ comment.createdBy.last_name }} -
                {{ comment.createdBy.organization }}
            </router-link>
        </div>
        <div class="ml-5">
            <div class="whitespace-pre-line">{{ comment.description }}</div>
        </div>
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
