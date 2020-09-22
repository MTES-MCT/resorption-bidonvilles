<template>
    <div class="mb-4">
        <Label>{{label}}</Label>
        <slot />
        <p class="text-error">{{error}}</p>
    </div>
</template>

<script>
    export default {
        name: 'FormGroup',
        props: {
            label: {
                type: String
            },
            error: {
                type: String
            }
        }
    }
</script>
