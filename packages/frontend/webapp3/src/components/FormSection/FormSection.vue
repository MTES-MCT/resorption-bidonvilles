<template>
    <div class="shadow-lg p-6">
        <h1
            v-if="$slots.title"
            class="text-2xl text-primary border-b pb-3 mb-6"
        >
            <slot name="title" />
        </h1>
        <slot />
    </div>
</template>
