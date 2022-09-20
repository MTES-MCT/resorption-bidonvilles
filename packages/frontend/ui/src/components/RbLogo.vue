<template>
    <img class="h-32" :src="logo" />
</template>

<script>
import logo from "../img/logo.svg";

export default {
    data() {
        return {
            logo
        };
    }
};
</script>