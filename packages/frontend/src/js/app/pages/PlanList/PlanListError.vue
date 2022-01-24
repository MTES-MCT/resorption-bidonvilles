<template>
    <div>
        <span> {{ error }}. </span>
        <Button
            variant="primaryText"
            @click="retryLoading"
            class="text-display-sm  -mb-1"
        >
            Réessayer?
        </Button>
    </div>
</template>

<script>
export default {
    props: {
        error: {
            type: String
        }
    },
    methods: {
        retryLoading() {
            this.$emit("retryLoading");
        }
    }
};
</script>
