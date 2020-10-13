<template>
  <div>
    <NavBar :sticky-header="stickyHeader" />
    <slot />
    <PublicFooter />
  </div>
</template>

<script>
import NavBar from './NavBar';
import PublicFooter from './PublicFooter';

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
