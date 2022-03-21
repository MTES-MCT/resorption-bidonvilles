<template>
    <li class="border-b border-gray-300 py-3 px-2">
        <Link
            :to="target"
            @click.native="$store.commit('navigation/closeMobileMenu')"
            >{{ label }}</Link
        >
    </li>
</template>
<script>
export default {
    props: {
        target: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        }
    }
};
</script>
