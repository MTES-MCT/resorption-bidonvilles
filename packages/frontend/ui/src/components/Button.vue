<template>
    <component
        :class="[
            'btn inline-block relative',
            sizeClasses,
            variantClasses,
            disabled && 'opacity-50 cursor-not-allowed'
        ]"
        :disabled="disabled || loading"
        :to="isLink && isInternalLink ? (disabled ? null : href) : null"
        :href="href"
        :is="isLink ? (isInternalLink ? 'router-link' : 'a') : 'button'"
        :type="isLink ? null : type"
        @click="onClick"
    >
        <div
            :class="[
                'flex',
                'items-center',
                iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
                loading && 'invisible'
            ]"
        >
            <div v-if="icon || $slots.icon">
                <slot name="icon">
                    <Icon :icon="icon" />
                </slot>
            </div>

            <div v-if="$slots.default" :class="iconPositionClasses">
                <slot></slot>
            </div>
        </div>
        <div
            v-if="loading"
            class="absolute inset-0 flex justify-center items-center"
        >
            <Icon icon="spinner" spin />
        </div>
    </component>
</template>

<script>
import Icon from "./Icon.vue";

export default {
    name: "MyButton",
    props: {
        variant: {
            type: String,
            default: "primary" // 'primary' or 'secondary'
        },
        type: String,
        href: String,
        size: {
            type: String,
            default: "md" // 'sm', 'md', 'lg'
        },
        icon: String,
        iconPosition: {
            type: String,
            default: "right" // 'left' or 'right'
        },
        loading: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        padding: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        iconPositionClasses() {
            if (!this.icon) {
                return "";
            }

            return {
                left: "ml-2",
                right: "mr-2"
            }[this.iconPosition];
        },
        sizeClasses() {
            return {
                sm: `text-sm ${this.padding === true ? "py-1 px-2" : ""}`,
                md: `text-md ${this.padding === true ? "py-2 px-4" : ""}`,
                lg: `text-lg ${this.padding === true ? "py-2 px-4" : ""}`
            }[this.size];
        },
        variantClasses() {
            return {
                primary:
                    "rounded-sm border-2 border-primary bg-primary text-white hover:bg-primaryDark focus:outline-none",
                secondary:
                    "rounded-sm border-2 border-secondary bg-secondary text-white hover:bg-secondaryDark focus:outline-none",
                tertiary:
                    "rounded-sm border-2 border-tertiary bg-tertiary text-white hover:bg-tertiaryDark hover:border-tertiaryDark focus:outline-none",
                specialEvent:
                    "rounded-sm bg-yellow-200 text-black hover:bg-yellow-400 focus:outline-none",
                primaryOutline:
                    "rounded-sm border-2 border-primary text-primary hover:bg-primary hover:text-white focus:outline-none",
                secondaryOutline:
                    "rounded-sm border-2  border-secondary text-secondary hover:bg-secondary hover:text-white focus:outline-none",
                primaryOutlineAlt:
                    "bg-white rounded-sm border-1 border-primary text-primary hover:bg-primary hover:text-white focus:outline-none",
                primaryText:
                    "text-primary hover:text-primaryDark focus:outline-none",
                secondaryText:
                    "text-secondary hover:text-secondaryDark focus:outline-none",
                text: "focus:outline-none",
                filter:
                    "rounded border-1 border-primary text-primary hover:bg-primary hover:text-white focus:outline-none"
            }[this.variant];
        },
        isLink() {
            return this.href !== undefined;
        },
        isInternalLink() {
            return this.isLink && this.href.slice(0, 1)[0] === "/";
        }
    },
    methods: {
        onClick(e) {
            this.$emit("click", e);
        }
    },
    components: {
        Icon
    }
};
</script>
