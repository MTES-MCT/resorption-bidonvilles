<template>
    <component :class="[
        'inline-flex relative items-center',
        focusClasses.ring,
        sizeClasses,
        variantClasses,
        disabled && 'opacity-85 cursor-not-allowed'
    ]" :disabled="disabled || isLoading" :to="isLink && isInternalLink && !disabled ? href : null" :href="href"
        :is="isLink ? (isInternalLink && !disabled ? 'router-link' : 'a') : 'button'" :type="isLink ? null : type"
        tabindex="0" @click="onClick">
        <span :class="[
            'flex',
            'items-center',
            iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
            isLoading && 'invisible'
        ]">
            <span v-if="icon || $slots.icon">
                <slot name="icon">
                    <Icon :icon="icon" />
                </slot>
            </span>

            <span v-if="$slots.default" :class="`${iconPositionClasses} ${truncate ? 'truncate' : ''}`">
                <slot></slot>
            </span>
        </span>
        <span v-if="isLoading" class="absolute inset-0 flex justify-center items-center">
            <Icon icon="spinner" spin />
        </span>
    </component>
</template>

<script>
import { useIsSubmitting } from "vee-validate";
import Icon from "./Icon.vue";
import focusClasses from "../../../common/utils/focus_classes";

export default {
    name: "MyButton",
    setup() {
        const isSubmitting = useIsSubmitting();
        return {
            isSubmitting,
            focusClasses,
        }
    },
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
        },
        truncate: {
            type: Boolean,
            default: false
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
                xs: `text-xs ${this.padding === true ? "py-1 px-1" : ""}`,
                sm: `text-sm ${this.padding === true ? "py-1 px-2" : ""}`,
                md: `text-md ${this.padding === true ? "py-2 px-4" : ""}`,
                lg: `text-lg ${this.padding === true ? "py-2 px-4" : ""}`
            }[this.size];
        },
        variantClasses() {
            return {
                primary:
                    "border-2 border-primary bg-primary text-white hover:bg-primaryDark",
                secondary:
                    "border-2 border-secondary bg-secondary text-white hover:bg-secondaryDark",
                tertiary:
                    "border-2 border-tertiary bg-tertiary text-white hover:bg-tertiaryDark hover:border-tertiaryDark",
                tertiaryA11Y:
                    "border-2 border-tertiaryA11Y bg-tertiaryA11Y text-white hover:bg-tertiaryA11Ydark hover:border-tertiaryA11Ydark",
                tertiaryA11Yalt:
                    "border-2 border-tertiaryA11Y bg-tertiaryA11Yalt text-white hover:bg-tertiaryA11Ydark hover:border-tertiaryA11Ydark",
                
                specialEvent:
                    "bg-yellow-200 text-black hover:bg-yellow-400",
                primaryOutline:
                    "border-2 border-primary text-primary hover:bg-primary hover:text-white",
                secondaryOutline:
                    "border-2  border-secondary text-secondary hover:bg-secondary hover:text-white",
                primaryOutlineAlt:
                    "bg-white border-1 border-primary text-primary hover:bg-primary hover:text-white",
                primaryText:
                    "text-primary hover:text-primaryDark hover:bg-G200",
                secondaryText:
                    "text-secondary hover:text-secondaryDark",
                filter:
                    "rounded border-1 border-primary text-primary hover:bg-primary hover:text-white"
            }[this.variant];
        },
        isLink() {
            return this.href !== undefined;
        },
        isInternalLink() {
            return this.isLink && this.href.slice(0, 1)[0] === "/";
        },
        isLoading() {
            return this.loading || this.isSubmitting;
        }
    },
    methods: {
        onClick(e) {
            if (this.disabled) {
                e.preventDefault();
            }
            this.$emit("clicked", e);
        }
    },
    components: {
        Icon
    }
};
</script>
