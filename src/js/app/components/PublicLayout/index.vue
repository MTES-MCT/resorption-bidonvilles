<template>
  <div>
    <NavBar :sticky-header="stickyHeader" />
    <slot />
    <PublicFooter />
  </div>
</template>

<script>
import NavBar from './NavBar/index.vue';
import PublicFooter from './PublicFooter.vue';

export default {
    components: {
        NavBar,
        PublicFooter,
    },
    props: {
        stickyHeader: {
            type: Boolean,
            default: true,
        },
    },
};
</script>
