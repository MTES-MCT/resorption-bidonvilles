<template>
    <div>
        <NavBar />
        <slot />
        <PublicFooter />
    </div>
</template>

<script>
    import NavBar from './NavBar'
    import PublicFooter from './PublicFooter'

    export default {
        components: {
            NavBar,
            PublicFooter
        }
    }
</script>
