<template>
    <div
        class="fixed bottom-0 bg-primary text-white w-full py-4 px-6 flex justify-between"
    >
        <NavbarItem icon="home" label="Sites" />
        <NavbarItem icon="pen" label="Notes" />
        <NavbarItem icon="unlink" label="Déconnexion" />
    </div>
</template>

<script>
import NavbarItem from "./NavbarItem";

export default {
    components: {
        NavbarItem
    }
};
</script>
