<template>
    <div>
        <a
            :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
            target="_blank"
        >
            <Icon class="text-display-lg" :icon="['fab', 'facebook-square']" />
        </a>
        {{ " " }}
        <a :href="`http://www.twitter.com/share?url=${url}`" target="_blank">
            <Icon class="text-display-lg" :icon="['fab', 'twitter-square']" />
        </a>
    </div>
</template>

<script>
export default {
    computed: {
        url() {
            return encodeURIComponent(
                "https://resorption-bidonvilles.beta.gouv.fr/#/contact"
            );
        }
    }
};
</script>
