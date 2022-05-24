<template>
    <section>
        <header class="md:flex items-start mb-5">
            <h1 class="text-xl font-bold" style="margin-top: -0.32em">
                {{ title }}
            </h1>
            <nav class="flex flex-1 justify-between items-start">
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
