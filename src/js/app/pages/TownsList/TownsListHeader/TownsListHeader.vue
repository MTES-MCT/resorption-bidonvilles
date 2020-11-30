<template>
    <div class="block md:flex justify-between items-baseline">
        <div>
            <div class="flex items-center mb-4">
                <slot name="filters" />
            </div>
            <div>
                <slot name="title" />
            </div>
        </div>
        <div class="block md:flex items-center">
            <slot name="buttons" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        search: {
            type: Object
        },
        showExport: {
            type: Function
        }
    }
};
</script>
