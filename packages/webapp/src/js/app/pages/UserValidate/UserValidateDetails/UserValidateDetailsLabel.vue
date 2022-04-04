<template>
    <div>
        <div>
            {{ label }}
        </div>
        <div>
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: { type: String }
    }
};
</script>
