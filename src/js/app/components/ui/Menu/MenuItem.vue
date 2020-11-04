<template>
    <div
        class="block px-4 py-2 text-md hover:bg-gray-100 cursor-pointer"
        role="menuitem"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot />
    </div>
</template>
