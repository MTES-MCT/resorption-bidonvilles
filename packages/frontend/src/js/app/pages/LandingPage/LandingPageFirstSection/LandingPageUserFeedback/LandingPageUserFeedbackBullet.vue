<template>
    <input
        type="radio"
        :class="[
            'appearance-none h-3 w-3 mx-1 cursor-pointer rounded-full border border-black outline-none',
            active && 'bg-black border-transparent'
        ]"
        :checked="active"
        @click="onClick"
    />
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean
        },
        onClick: {
            type: Function
        }
    }
};
</script>
