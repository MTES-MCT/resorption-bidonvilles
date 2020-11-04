import { deleteComment } from "#helpers/api/town";

export default {
    props: {
        comment: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            status: null,
            error: null,
            message: ""
        };
    },

    computed: {
        date() {
            return App.formatDate(this.comment.date, "d/m/y");
        },
        time() {
            return App.formatDate(this.comment.date, "h:i");
        },
        address() {
            return `${this.comment.shantytown.usename}, ${this.comment.shantytown.city}`;
        }
    },

    mounted() {
        setTimeout(() => {
            document.addEventListener("click", this.checkOutsideClick);
        }, 500);
    },

    destroyed() {
        document.removeEventListener("click", this.checkOutsideClick);
    },

    methods: {
        checkOutsideClick(event) {
            if (!this.$refs.wrapper.contains(event.target)) {
                this.close();
            }
        },

        close() {
            if (this.status === "pending") {
                return;
            }

            this.$emit("close");
        },

        deleteComment() {
            if (this.status === "pending") {
                return;
            }

            this.status = "pending";
            this.error = null;

            deleteComment(
                this.comment.shantytown.id,
                this.comment.id,
                this.message
            )
                .then(() => {
                    this.status = null;
                    this.message = "";
                    this.$emit("deleted");
                })
                .catch(({ user_message: error }) => {
                    this.status = null;
                    this.error = error;
                });
        }
    }
};
