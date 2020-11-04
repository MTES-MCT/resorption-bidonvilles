<template>
    <div
        :class="[color, 'inline-flex text-sm px-4 py-1 flex-row items-center']"
    >
        <slot />
        <span class="ml-2 cursor-pointer" @click="onDelete" v-if="onDelete">
            <Icon icon="times" />
        </span>
    </div>
</template>

<script>
export default {
    props: {
        onDelete: {
            type: Function
        },
        color: {
            type: String,
            default: "bg-G200"
        }
    }
};
</script>
