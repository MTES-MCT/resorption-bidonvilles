import Input from './input/input.vue';
import SlideNote from '#app/components/slide-note/slide-note.vue';
import { notify } from '#helpers/notificationHelper';

export default {


    components: {
        Input,
        SlideNote,
    },


    props: {
        /**
         * Title of the form
         *
         * @type {String}
         */
        title: {
            type: String,
            required: false,
        },

        /**
         * Description title of the form
         *
         * @type {String}
         */
        descriptionTitle: {
            type: String,
            required: false,
        },

        /**
         * Description of the form
         *
         * @type {String}
         */
        description: {
            type: String,
            required: false,
        },

        /**
         * List of steps
         *
         * @type {Array.<FormStep>}
         */
        steps: {
            type: Array,
            required: true,
        },

        /**
         * Value of the inputs
         *
         * @type {Object.<string,Object>}
         */
        value: {
            type: Object,
            required: false,
            default() {
                return {};
            },
        },
    },


    data() {
        return {
            /**
             * Index of the current step
             *
             * @type {Number}
             */
            currentStepIndex: 0,

            /**
             * Data
             *
             * @type {Object.<string,Object>}
             */
            data: this.value,

            /**
             * Whether a submission is pending
             *
             * @type {Boolean}
             */
            pending: false,

            /**
             * Errors
             *
             * @type {Object}
             */
            errors: null,

            /**
             * Responses
             *
             * @type {Array.<Object|null>}
             */
            responses: [],
        };
    },


    computed: {
        /**
         * Computes the list of all breadcrumb items
         *
         * The breadcrumb items includes:
         * - one item per form step
         * - one separator item in-between each form step
         *
         * @returns {Array.<FormBreadcrumbItem>}
         */
        breadcrumbItems() {
            return this.steps.reduce((breadcrumb, step, stepIndex) => [
                ...breadcrumb,
                ...[
                    Object.assign({}, step, {
                        classNames: {
                            'form-breadcrumbItem': true,
                            'form-breadcrumbItem--current': stepIndex === this.currentStepIndex,
                            'form-breadcrumbItem--done': stepIndex < this.currentStepIndex,
                        },
                        isSeparator: false,
                        stepIndex,
                    }),
                    {
                        classNames: {
                            'form-breadcrumbSeparator': true,
                        },
                        isSeparator: true,
                    },
                ],
            ], []).slice(0, -1);
        },

        /**
         * Current step
         *
         * @returns {FormStep|null}
         */
        currentStep() {
            return this.steps[this.currentStepIndex] || null;
        },

        /**
         * List of sections of the current step
         *
         * @returns {Array.<FormSection>}
         */
        sections() {
            return this.currentStep ? this.currentStep.sections : [];
        },

        /**
         * List of sections of the current step with at least one input
         *
         * @returns {Array.<FormSection>}
         */
        fullSections() {
            return this.sections.filter(({ inputs }) => Object.values(inputs).some(input => this.isInputVisible(input)));
        },

        /**
         * Inputs of the current step
         *
         * @returns {Array.<Input>}
         */
        inputs() {
            return this.currentStep.sections
                .reduce((inputs, section) => Object.assign({}, inputs, section.inputs), {});
        },

        /**
         * Wording
         *
         * @returns {FormStepWording}
         */
        wording() {
            return Object.assign({
                submit: 'Étape suivante',
                error: 'Certaines données saisies sont incorrectes',
                success: null,
            }, this.currentStep.wording || {});
        },

        /**
         * Filtered data
         *
         * Basically, the data of active inputs.
         *
         * @returns {Object}
         */
        filteredData() {
            const inputIds = Object.keys(this.inputs);
            return inputIds
                .filter(id => this.isInputActive(this.inputs[id]))
                .reduce((data, id) => Object.assign({}, data, {
                    [id]: this.data[id],
                }), {});
        },

        /**
         * Errors matching existing inputs
         *
         * @returns {Object}
         */
        filteredErrors() {
            if (!this.errors) {
                return null;
            }

            return Object.keys(this.errors.fields || {})
                .filter(inputId => this.inputs[inputId] !== undefined)
                .reduce((errors, inputId) => Object.assign({}, errors, {
                    [inputId]: this.errors.fields[inputId],
                }), {});
        },

        /**
         * Number of filtered errors
         *
         * @returns {Number}
         */
        numberOfFilteredErrors() {
            if (!this.filteredErrors) {
                return 0;
            }

            return Object.keys(this.filteredErrors).length;
        },

        /**
         *
         */
        submitPrefix() {
            return this.currentStep && this.currentStep.submitPrefix;
        },
    },


    watch: {
        // two-way binding
        value() {
            this.data = this.value;
        },
        data() {
            this.onDataChange();
        },
    },


    methods: {
        /**
         * Submits the current user's input for validation
         *
         * @returns {undefined}
         */
        submit() {
            if (!this.currentStep.submit) {
                this.goToNextStep(null);
                return;
            }

            if (this.pending === true) {
                return;
            }

            this.pending = true;
            this.errors = null;

            this.currentStep.submit(this.filteredData, this.responses)
                .then((response) => {
                    if (this.wording.success !== null) {
                        notify({
                            group: 'notifications',
                            type: 'success',
                            title: 'Succès',
                            text: this.wording.success,
                        });
                    }

                    this.$emit('stepcomplete', this.currentStepIndex, response);
                    this.goToNextStep(response);

                    this.pending = false;
                    this.errors = null;
                })
                .catch((error) => {
                    this.pending = false;
                    this.errors = {
                        main: (error && error.user_message) || 'erreur inconnue',
                        fields: (error && error.fields) || {},
                    };
                });
        },

        /**
         * Shows the next step, if any
         *
         * @param {Object|null} response Response got from the submission promise
         *
         * @returns {undefined}
         */
        goToNextStep(response) {
            this.responses.push(response);

            if (this.currentStepIndex >= this.steps.length - 1) {
                this.$emit('complete', response, this.responses);
                return;
            }

            this.currentStepIndex += 1;
        },

        /**
         * Finds an input based on the given id
         *
         * @param {String} inputId
         *
         * @returns {Input}
         */
        getInputById(inputId) {
            if (this.currentStep === null) {
                return null;
            }

            return this.inputs[inputId] || null;
        },

        /**
         * Handles a change in the value of one of the inputs
         *
         * @returns {undefined}
         */
        onDataChange() {
            this.$emit('input', this.data);
        },

        /**
         * Indicates whether the given input is active or not
         *
         * @param {Input} input
         *
         * @returns {Boolean}
         */
        isInputActive(input) {
            if (!input.condition) {
                return true;
            }

            return input.condition(this.data);
        },

        /**
         * Indicates whether the given input is visible or not
         *
         * Please note that an input might be visible but inactive (meaning disabled and
         * not included in filtered-data).
         *
         * @param {Input} input
         *
         * @returns {Boolean}
         */
        isInputVisible(input) {
            return this.isInputActive(input) || input.inactiveMessage;
        },

        /**
         * Indicates whether the given input is disabled or not
         *
         * @param {Input} input
         *
         * @returns {Boolean}
         */
        isInputDisabled(input) {
            return this.pending === true || input.disabled === true || (input.inactiveMessage && !this.isInputActive(input));
        },

        /**
         * Returns the alert message to be displayed for the given input
         *
         * @param {Input} input
         *
         * @returns {String|Null}
         */
        getInputAlert(input) {
            if (input.inactiveMessage && !this.isInputActive(input)) {
                return input.inactiveMessage;
            }

            return null;
        },
    },

};

/**
 * @typedef {Object} FormStepWording
 * @property {String} submit  Label of the button leading to the next step
 * @property {String} error   Prefix of the error notification, in case of submissions failure
 * @property {String} success Content of the success notification, in case of submission success
 */

/**
 * @typedef {Object} FormStep
 * @property {String}              title          Title of the step
 * @property {Array.<FormSection>} sections
 * @property {FormStepWording}     [wording]      Custom wording
 * @property {Function}            [submit]       Function called with the user's input. Should return a promise.
 * @property {String}              [submitPrefix] Prefix text that is displayed above the submit button (HTML accepted)
 */

/**
 * @typedef {Object} FormSection
 * @property {String}                [title] Title of that section
 * @property {String}                [description] Description of that section
 * @property {Object.<string,FormInput>} inputs  List of inputs
 */

/**
 * @typedef {Input} FormInput
 * @property {Function} [condition]       A function that indicates if the input should be active or not
 * @property {String}   [inactiveMessage] Message to be displayed if inactive (if not provided, the whole input will be invisible)
 */

/**
 * @typedef {FormStep} FormBreadcrumbItem
 * @property {Object}  classNames  A map of dynamic CSS classes for that item
 * @property {Boolean} isSeparator Whether this item is a separator item or not
 * @property {Number}  [stepIndex] Absolute index of the related form step (not set for separator items)
 */
