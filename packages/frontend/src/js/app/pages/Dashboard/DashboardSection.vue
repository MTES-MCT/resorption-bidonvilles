<template>
    <section class="pb-10">
        <header class="md:flex items-center mb-5">
            <h1 class="text-xl font-bold">{{ title }}</h1>
            <nav class="flex flex-1 justify-between items-center mt-1">
                <slot name="header_left" />
                <slot name="header_right" />
            </nav>
        </header>

        <slot name="body" />
    </section>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    }
};
</script>
