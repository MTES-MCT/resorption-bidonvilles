import Autocompleter from "../autocompleter/autocompleter.vue";
import { autocompleteLocation as autocompleter } from "#helpers/addressHelper";

export default {
    components: {
        Autocompleter
    },

    props: {
        /**
         * @type {Address|null}
         */
        value: {
            type: Object,
            required: false,
            default() {
                return null;
            }
        },

        /**
         * Whether the input should be disabled or not
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },

        /**
         * Properties specific to the input
         *
         * @type {Object}
         */
        specificProps: {
            type: Object,
            required: false,
            default() {
                return {};
            }
        }
    },

    data() {
        return {
            /**
             * @type {Array.<Address>}
             */
            data: this.value !== null ? [this.value] : [],

            /**
             * @type {Object}
             */
            options: {
                ...this.specificProps,
                showCategory: true,
                autocompleter: (...args) => {
                    const p1 = autocompleter(...args);
                    const p2 = p1.then(result =>
                        result.map(({ label, code, type, locationType }) => ({
                            id: code,
                            label,
                            category: type,
                            data: {
                                code,
                                type: locationType
                            }
                        }))
                    );
                    p2.abort = p1.abort;
                    return p2;
                }
            }
        };
    },

    watch: {
        // two-way binding
        value() {
            this.data = this.value !== null ? [this.value] : [];
        },
        data() {
            this.$emit("input", this.data.length > 0 ? this.data[0] : null);
        }
    }
};
