<template>
    <Layout>
        <div class="mx-4 my-4 font-bold text-xl">
            Bienvenue {{ user.first_name }} {{ user.last_name }}
        </div>
    </Layout>
</template>

<script>
import Layout from "#src/js/components/Layout.vue";

export default {
    components: {
        Layout
    },
    computed: {
        user() {
            return this.$store.state.config.configuration.user;
        }
    }
};
</script>
