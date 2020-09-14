<template>
    <div>
        {{ $t('hello', messages) }}
    </div>
</template>

<script>
    const messages = {
        fr: {
            hello: 'Bonjour'
        },
        en: {
            hello: 'coucou'
        }
    }

    export default {
       data() {
            return {
                messages
            }
       },
        mounted() {
            console.log(this.$i18n.locale)
        }
    }
</script>
