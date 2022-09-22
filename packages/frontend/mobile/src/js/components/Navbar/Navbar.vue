<template>
    <nav class="bg-primary text-white w-full py-4 px-6 ">
        <div class="flex justify-between max-w-lg mx-auto">
            <NavbarItem
                icon="home"
                label="Sites"
                @click.native="showTownsTab"
            />
            <NavbarItem icon="pen" label="Notes" @click.native="showNotesTab" />
            <NavbarItem
                icon="unlink"
                label="Déconnexion"
                @click.native="signout"
            />
        </div>
    </nav>
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
        showNotesTab() {
            if (this.$router.currentRoute.path === "/liste-des-notes") {
                return;
            }

            this.$router.push("/liste-des-notes");
        },
        signout() {
            this.$router.push("/deconnexion");
        }
    }
};
</script>
