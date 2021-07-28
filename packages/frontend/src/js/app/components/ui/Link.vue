<template>
    <router-link :to="to" class="text-primary hover:text-primaryDark"
        ><slot></slot
    ></router-link>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            required: true
        }
    }
};
</script>
