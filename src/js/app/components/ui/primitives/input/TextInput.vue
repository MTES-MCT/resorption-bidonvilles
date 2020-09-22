<template>
    <input type="text"
           @input="$emit('input', $event.target.value)"
           v-bind="$props"
           class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 focus:outline-none focus:bg-white focus:border-primary" />
</template>

<script>
export default {
    name: "TextInput",
    props: {}
}
</script>

