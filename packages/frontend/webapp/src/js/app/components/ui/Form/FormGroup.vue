<template>
    <div class="shadow py-5 px-6">
        <div class="text-primary text-display-lg font-bold pb-4 border-b-2">
            {{ title }}
        </div>
        <div class="pt-4">
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
