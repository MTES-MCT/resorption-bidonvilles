<template>
    <div
        class="fixed bottom-0 bg-primary text-white w-full py-4 px-6 flex justify-between"
    >
        <NavbarItem icon="home" label="Sites" @click.native="showTownsTab" />
        <NavbarItem icon="pen" label="Notes" />
        <NavbarItem icon="unlink" label="Déconnexion" @click.native="signout" />
    </div>
</template>

<script>
import NavbarItem from "./NavbarItem";

export default {
    components: {
        NavbarItem
    },
    methods: {
        showTownsTab() {
            if (this.$router.currentRoute.path === "/liste-des-sites") {
                return;
            }

            this.$router.push("/liste-des-sites");
        },
        signout() {
            this.$router.push("/deconnexion");
        }
    }
};
</script>
