<template>
    <div class="p-4 bg-G100">
        <div class="flex justify-between mb-4">
            <div class="text-display-sm">Message</div>
            <div>{{ formatDate(user.created_at, "d M y") }}</div>
        </div>

        <div>
            {{ user.access_request_message }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        user: {
            type: Object
        }
    },
    methods: {
        formatDate(...args) {
            return App.formatDate.call(App, ...args);
        }
    }
};
</script>
