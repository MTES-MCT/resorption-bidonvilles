import Address from "../address/address.vue";
import Location from "../location/location.vue";

export default {
    components: {
        Address,
        Location
    },

    props: {
        /**
         * @type {AddressWithLocationValue}
         */
        value: {
            type: Object,
            required: false,
            default() {
                return null;
            }
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
                return {
                    address: {},
                    location: {}
                };
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
        }
    },

    data() {
        return {
            /**
             * @type {Array.<Address>}
             */
            address: this.value !== null ? this.value.address : undefined,

            /**
             * @type {MapView}
             */
            location: this.value !== null ? this.value.location : undefined
        };
    },

    computed: {
        /**
         * Options for the address component
         *
         * @returns {Object}
         */
        addressOptions() {
            return { ...this.specificProps.address };
        },

        /**
         * Options for the location component
         *
         * @returns {Object}
         */
        locationOptions() {
            return {
                ...this.specificProps.location,
                tutorial: this.address ? "auto" : "yes",
                autoHideMarker: !this.address,
                wording: this.address
                    ? {
                          tutorialTitle: "Adresse détectée",
                          tutorialDescription:
                              "Vous pouvez déplacer le marqueur en cliquant à l'endroit souhaité sur la carte"
                      }
                    : {
                          tutorialTitle: "Saisir une adresse",
                          tutorialDescription:
                              "Veuillez saisir une adresse dans le champ de texte ci-dessus avant d'accéder à la carte"
                      }
            };
        },

        /**
         * Current value of the address/location
         *
         * @returns {AddressWithLocationValue}
         */
        data() {
            if (!this.address) {
                return null;
            }

            return {
                address: this.address,
                location: this.location
            };
        }
    },

    watch: {
        // two-way binding
        value() {
            this.address = this.value !== null ? this.value.address : undefined;
            this.location =
                this.value !== null ? this.value.location : undefined;
        },
        address() {
            if (this.address) {
                const [lon, lat] = this.address.coordinates;
                this.location = {
                    coordinates: [lat, lon],
                    zoom: 15
                };
            }

            this.$emit("input", this.data);
        },
        location() {
            this.$emit("input", this.data);
        }
    }
};

/**
 * @typedef {Object} AddressWithLocationValue
 * @property {Address} address
 * @property {MapView} location
 */
