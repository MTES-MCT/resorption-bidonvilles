<template>
    <component
            :class="['btn inline-block relative', sizeClasses, variantClasses, this.disabled && 'opacity-50 cursor-not-allowed']"
            :disabled="disabled || loading"
            :href="isLink ? (disabled ? null : href) : null"
            :is="isLink ? 'a' : 'button'"
            :type="isLink ? null : type"

            @click="onClick"
    >
        <div :class="['flex', iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row', loading && 'invisible']">
            <div v-if="icon || $slots.icon">
                <slot name="icon">
                    <Icon :icon="icon" />
                </slot>
            </div>

            <div v-if="$slots.default" :class="iconPosition === 'right' ? 'mr-2' : 'ml-2'">
                <slot></slot>
            </div>
        </div>
        <div v-if="loading" class="absolute inset-0 flex justify-center items-center">
            <Icon icon="spinner" spin />
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
            default: 'primary', // 'primary' or 'secondary'
        },
        type: String,
        href: String,
        size: {
            type: String,
            default: 'md', // 'sm', 'md', 'lg'
        },
        icon: String,
        iconPosition: {
            type: String,
            default: 'right', // 'left' or 'right'
        },
        loading: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        iconPositionClass() {
            return {
                left: 'mr-2',
                right: 'ml-2',
            };
        },
        sizeClasses() {
            return {
                sm: `text-sm ${this.isLink ? '' : 'py-1 px-2'}`,
                md: `text-md ${this.isLink ? '' : 'py-2 px-4'}`,
                lg: `text-lg ${this.isLink ? '' : 'py-2 px-4'}`,
            }[this.size];
        },
        variantClasses() {
            return {
                primary: 'border-2 border-primary bg-primary text-white hover:bg-primaryDark',
                secondary: 'border-2 border-secondary bg-secondary text-white hover:bg-secondaryDark',
                primaryOutline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
                secondaryOutline: 'border-2  border-secondary text-secondary hover:bg-secondary hover:text-white',
                primaryText: 'text-primary hover:text-primaryDark',
                secondaryText: 'text-secondary hover:text-secondaryDark',

            }[this.variant];
        },
        isLink() {
            return this.href !== undefined;
        },
    },
    methods: {
        onClick(e) {
            this.$emit('click', e);
        },
    },
    components: {
        Icon,
    },
};
</script>
