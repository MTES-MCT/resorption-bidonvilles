<template>
    <div class="block md:flex justify-between items-baseline">
        <div>
            <div class="flex items-center mb-4 print:hidden">
                <slot name="filters" />
            </div>
            <div>
                <slot name="title" />
            </div>
        </div>
        <div class="block md:flex items-center print:hidden">
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
