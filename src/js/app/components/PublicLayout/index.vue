<template>
    <div>
        <NavBar :stickyHeader="stickyHeader" />
        <slot />
        <PublicFooter />
    </div>
</template>

<script>
import NavBar from './NavBar';
import PublicFooter from './PublicFooter';

export default {
    props: {
        stickyHeader: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        NavBar,
        PublicFooter,
    },
};
</script>
