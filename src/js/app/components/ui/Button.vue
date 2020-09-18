<template>
    <component :is="type" :href="href" :type="submit" :class="['btn rounded text-white', sizeClass, variantClass]">
        <slot/>
    </component>
</template>

<script>
    export default {
        name: "Button",
        props: {
            /**
             * The html element used for the button.
             * `button, a`
             */
            type: {
                type: String,
                default: "button",
                validator: value => {
                    return value.match(/(button|a)/)
                },
            },
            /**
             * The size of the button. Defaults to medium.
             * `small, medium, large`
             */
            size: {
                type: String,
                default: "medium",
                validator: value => {
                    return value.match(/(small|medium|large)/)
                },
            },
            /**
             * When setting the button’s type to a link, use this option to give a href.
             */
            href: {
                type: String,
                default: null,
            },
            /**
             * Set the button’s type to “submit”.
             */
            submit: {
                type: String,
                default: null,
                validator: value => {
                    return value.match(/(null|submit)/)
                },
            },
            /**
             * Style variation to give additional meaning.
             * `primary, secondary`
             */
            variant: {
                type: String,
                default: null,
                validator: value => {
                    return value.match(/(primary|secondary)/)
                },
            },
        },
        computed: {
            sizeClass() {
                return {
                    small: 'py-1 px-2',
                    medium: 'py-2 px-4',
                    large: 'py-2 px-4'
                }[this.size]
            },
            variantClass() {
                return {
                    primary: 'bg-primary',
                    secondary: 'bg-secondary'
                }[this.variant]
            }
        }

    }
</script>
