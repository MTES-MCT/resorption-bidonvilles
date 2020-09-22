<template>
    <component
            :class="['btn rounded text-white', sizeClasses, variantClasses]"
            :disabled="disabled || loading"
            :href="isLink ? (disabled ? null : href) : null"
            :is="isLink ? 'a' : 'button'"
            :type="isLink ? null : type"

            @click="onClick"
    >
        <div class="ui-button__content">
            <div class="ui-button__icon" v-if="icon || $slots.icon">
                <slot name="icon">
                    <Icon :icon="icon" />
                </slot>
            </div>

            <slot></slot>
        </div>
    </component>
</template>

<script>
    import Icon from './Icon.vue';

    export default {
        name: 'Button',
        props: {
            variant: {
                type: String,
                default: 'primary' // 'primary' or 'secondary'
            },
            type: String,
            href: String,
            size: {
                type: String,
                default: 'normal' // 'small', 'normal', 'large'
            },
            icon: String,
            iconPosition: {
                type: String,
                default: 'left' // 'left' or 'right'
            },
            loading: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            sizeClasses() {
                return {
                    small: 'py-1 px-2',
                    normal: 'py-2 px-4',
                    large: 'py-2 px-4'
                }[this.size]
            },
            variantClasses() {
                return {
                    primary: 'bg-primary',
                    secondary: 'bg-secondary'
                }[this.variant]
            },
            isLink() {
                return this.href !== undefined;
            },
        },
        methods: {
            onClick(e) {
                this.$emit('click', e);
            }
        },
        components: {
            Icon
        }
    };
</script>
