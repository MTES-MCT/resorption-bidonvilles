<template>
    <div>
        <a :href="url" target="_blank"><slot>{{defaultText}}</slot></a>
    </div>
</template>

<script>
    export default {
        props: {
            examplePath: {
                type: String
            },
            docPath: {
                type: String
            },
            componentPath: {
                type: String
            }
        },
        computed: {
            url() {
                if (this.examplePath) {
                    return `https://github.com/MTES-MCT/action-bidonvilles/tree/design-system/docs/src/.vuepress/components/${this.examplePath}`
                }

                if (this.docPath) {
                    return `https://github.com/MTES-MCT/action-bidonvilles/tree/design-system/docs/src/design/${this.docPath}`
                }

                if (this.componentPath) {
                    return `https://github.com/MTES-MCT/action-bidonvilles/tree/design-system/src/js/app/components/ui/${this.componentPath}`
                }
            },
            defaultText() {
                if (this.examplePath) {
                    return `Voir code`
                }

                if (this.docPath) {
                    return `Editer cette page`
                }

                if (this.componentPath) {
                    return `Code du composant`
                }
            }
        }

    }
</script>
