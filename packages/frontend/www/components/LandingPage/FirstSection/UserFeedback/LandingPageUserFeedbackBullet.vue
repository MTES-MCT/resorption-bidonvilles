<template>
    <button
        type="button"
        :aria-label="alt"
        :class="[
            'inline-block appearance-none h-3 w-3 mx-1 cursor-pointer rounded-full border-1 border-black outline-none',
            active && 'bg-black border-transparent'
        ]"
        :checked="active"
        @click="onClick"
    />
</template>

<script>
export default {
    props: {
        alt: {
            type: String,
            required: true
        },
        active: {
            type: Boolean
        },
        onClick: {
            type: Function
        }
    }
};
</script>
