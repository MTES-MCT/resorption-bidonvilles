<template>
    <div>
        <span :class="color">
            <Icon :icon="icon" />
            <span> {{ text }}</span>
        </span>
        <span> le {{ formatDate(date, "d M y") }} </span>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        icon: {
            type: String
        },
        color: {
            type: String
        },
        date: {
            type: Number
        },
        text: {
            type: String
        }
    },
    methods: {
        formatDate(...args) {
            return App.formatDate.call(App, ...args);
        }
    }
};
</script>
