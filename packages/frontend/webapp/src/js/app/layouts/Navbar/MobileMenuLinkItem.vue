<template>
    <li class="border-b-1 border-gray-300 py-3 px-2">
        <Link :to="target" @click.native="onClick">{{ label }}</Link>
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
        },
        matomo: {
            type: Object,
            required: false
        }
    },

    methods: {
        onClick() {
            if (this.matomo) {
                this.$trackMatomoEvent(
                    this.matomo.category,
                    this.matomo.action
                );
            }

            this.$store.commit("navigation/closeMobileMenu");
        }
    }
};
</script>
