<template>
    <div>
        <NavBar />
        <LoadingError>
            La page demandée n'existe pas
        </LoadingError>
    </div>
</template>

<script>
import LoadingError from "#app/components/PrivateLayout/LoadingError.vue";
import NavBar from "#app/layouts/Navbar/Navbar.vue";

export default {
    components: {
        LoadingError,
        NavBar
    }
};
</script>
