<template>
    <div class="items-center">
        <Tag variant="primary" v-for="topic in topics" v-bind:key="topic.name">
            {{ topic.name }}
        </Tag>
    </div>
</template>

<script>
export default {
    props: {
        topics: {
            type: Array
        }
    }
};
</script>
