<template>
    <div>
        <div class="md:flex justify-between items-baseline print:hidden mb-4">
            <div class="md:flex items-center">
                <slot name="filters" />
            </div>
            <div>
                <slot name="buttons" />
            </div>
        </div>
        <div>
            <slot name="title" />
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
