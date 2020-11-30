<template>
    <div
        class="py-1 rounded-md bg-white shadow-xs"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot />
    </div>
</template>
