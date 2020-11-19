<template>
    <div>
        <router-link :to="to" :class="activeSection && 'text-primary'">
            <slot />
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        to: {
            type: String
        },
        activeSection: {
            type: Boolean
        }
    }
};
</script>
