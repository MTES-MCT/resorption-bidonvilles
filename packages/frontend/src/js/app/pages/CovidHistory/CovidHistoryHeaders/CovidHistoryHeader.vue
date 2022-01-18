<template>
    <div>
        <div>
            <h1 class="text-display-lg mb-4 whitespace-nowrap">Covid-19</h1>
            <h2 class="mb-4">
                L'ensemble des commentaires sur votre territoire (département ou
                région)
            </h2>
        </div>

        <div class="md:flex justify-between items-baseline print:hidden mb-4">
            <div class="md:flex items-center">
                <slot name="filters" />
            </div>
            <div>
                <slot name="buttons" />
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>
