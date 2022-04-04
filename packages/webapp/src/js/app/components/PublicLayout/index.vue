<template>
    <div>
        <NavBar
            :stickyHeader="stickyHeader"
            :displayLanguagePicker="displayLanguagePicker"
        >
            <template v-slot:anchors><slot name="anchors"></slot></template>
        </NavBar>
        <slot />
        <PublicFooter />
    </div>
</template>

<script>
import NavBar from "./NavBar/index.vue";
import PublicFooter from "./PublicFooter.vue";

export default {
    props: {
        stickyHeader: {
            type: Boolean,
            default: true
        },
        displayLanguagePicker: {
            type: Boolean,
            default: false
        }
    },
    components: {
        NavBar,
        PublicFooter
    }
};
</script>
