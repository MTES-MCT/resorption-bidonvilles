import Modal from "#app/components/modal/modal.vue";

export default {
    props: {
        link: {
            type: String,
            required: true
        }
    },

    components: {
        Modal
    },

    data() {
        return {
            /**
             * Wether the activation link could be automatically copied to the clipboard
             *
             * @type {boolean}
             */
            linkWasCopied: false
        };
    },

    mounted() {
        this.$nextTick(() => {
            try {
                this.$refs.input.select();
                document.execCommand("copy");
                this.linkWasCopied = true;
            } catch (ignore) {
                // do nothing
            }
        });
    },

    methods: {
        onClose() {
            this.$emit("close");
        }
    }
};
