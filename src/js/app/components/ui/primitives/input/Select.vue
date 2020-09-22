<template>
    <div class="relative">
        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" v-bind="$props" @change="$emit('input', $event.target.value)">
            <slot />
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <Icon icon="chevron-down" />
        </div>
    </div>
</template>

<script>
    export default {
        name: "Select",
        props: {}
    }
</script>

