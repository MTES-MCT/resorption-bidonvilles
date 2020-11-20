<template>
    <div
        :class="[
            'pl-2 border-l-4 my-2',
            activeSection
                ? 'text-primary  border-primary'
                : 'border-transparent'
        ]"
    >
        <router-link :to="to">
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
