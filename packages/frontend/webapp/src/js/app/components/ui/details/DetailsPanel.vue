<template>
    <div class="detailsPanelShadow py-5 px-6">
        <div class="text-primary text-display-lg font-bold">
            <slot name="title" />
        </div>
        <div class="pt-4">
            <slot name="body" />
        </div>
    </div>
</template>

<style scoped>
.detailsPanelShadow {
    box-shadow: 0 0px 20px 0 rgba(0, 0, 0, 0.1), 0 0px 0px 0 rgba(0, 0, 0, 0.06);
    border-radius: 5px;
}
</style>
