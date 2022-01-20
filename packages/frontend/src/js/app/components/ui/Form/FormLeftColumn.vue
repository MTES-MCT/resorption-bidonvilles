<template>
    <div>
        <div class="sticky stickyColumn">
            <div class="font-bold">Rubriques</div>
            <LeftColumnNavLink
                v-for="section in sections"
                :key="section.id"
                :to="`#${section.id}`"
                :activeSection="activeSection === section.id"
                >{{ section.label }}</LeftColumnNavLink
            >
        </div>
    </div>
</template>

<script>
import LeftColumnNavLink from "./FormLeftColumnNavLink";
export default {
    components: { LeftColumnNavLink },
    props: {
        defaultSection: {
            type: String,
            required: false
        },
        sections: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            activeSection: this.defaultSection || this.sections[0].id
        };
    },
    methods: {
        observe(nbTries = 1) {
            // On mount, dom isn't always ready
            // Loop until expected divs are present
            const lastSectionId = this.sections.slice(-1)[0].id;
            if (!document.querySelector(`#${lastSectionId}`) && nbTries < 10) {
                setTimeout(() => {
                    this.observe(nbTries + 1);
                }, 50);
                return;
            }

            const callback = entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.activeSection = entry.target.id;
                    }
                });
            };

            let observer = new IntersectionObserver(callback, {
                rootMargin: "0px",
                threshold: 0.2
            });

            this.sections.forEach(({ id }) => {
                observer.observe(document.querySelector(`#${id}`));
            });
        }
    },
    mounted() {
        this.observe();
    }
};
</script>

<style scoped>
.stickyColumn {
    top: 32px;
}
</style>
