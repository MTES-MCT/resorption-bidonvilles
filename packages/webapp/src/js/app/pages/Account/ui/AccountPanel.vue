<template>
    <div class="accountPanelShadow py-5 px-6 mt-8 max-w-4xl ml-auto">
        <div class="text-primary text-display-lg border-b pb-4">
            {{ title }}
        </div>
        <div class="pt-8">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        }
    }
};
</script>

<style scoped>
.accountPanelShadow {
    box-shadow: 0 0px 20px 0 rgba(0, 0, 0, 0.1), 0 0px 0px 0 rgba(0, 0, 0, 0.06);
    border-radius: 5px;
}
</style>
