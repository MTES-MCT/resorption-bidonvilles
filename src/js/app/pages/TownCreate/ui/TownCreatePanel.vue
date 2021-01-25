<template>
    <div class="shadow p-5">
        <div class="text-primary text-display-lg pb-4 border-b-2">
            <slot name="title" />
        </div>
        <div class="pt-4">
            <slot name="body" />
        </div>
    </div>
</template>
