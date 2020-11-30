/**
 * Default timeout before triggering a suggestion request
 *
 * In milliseconds.
 *
 * @type {Number}
 */
const DEFAULT_TIMEOUT = 200;

export default {
    props: {
        /**
         * Function that can generate autocompletion suggestions
         *
         * The function must:
         * - take a string as an argument
         * - return a promise
         * - that promise eventually resolves with an Array.<AutocompleteItem>
         *
         * @type {Function}
         */
        autocompleter: {
            type: Function,
            required: true
        },

        /**
         * Whether the category of each item should be displayed
         *
         * @type {Boolean}
         */
        showCategory: {
            type: Boolean,
            required: false,
            default: false
        },

        /**
         * Whether the component allows to select more than one item
         *
         * @type {Boolean}
         */
        allowMultiple: {
            type: Boolean,
            required: false,
            default: false
        },

        /**
         * Whether the suggestions should be in position absolute
         *
         * @type {Boolean}
         */
        float: {
            type: Boolean,
            required: false,
            default: true
        },

        /**
         * Custom wording
         *
         * @type {Object.<string,string>}
         */
        wording: {
            type: Object,
            required: false,
            default() {
                return {
                    // appears above the list of selected items
                    selectedItems: "Éléments sélectionnés",
                    // label for the column containing the label of each selected item
                    label: "Label"
                };
            }
        },

        /**
         * Function to be called when the item 'Add new item' is selected
         *
         * Please note that the item 'Add new item' is automatically added to the list
         * only if this function is provided.
         *
         * @type {Function}
         */
        createNew: {
            type: Function,
            required: false,
            default: null
        },

        /**
         * Default selected items
         *
         * @type {Array.<AutocompleteItem>}
         */
        value: {
            type: Array,
            required: false,
            default() {
                return [];
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
         * Placeholder
         *
         * @type {String}
         */
        placeholder: {
            type: String,
            required: false
        }
    },

    data() {
        let label = "";
        if (!this.allowMultiple && this.value.length === 1) {
            [{ label }] = this.value;
        }

        return {
            /**
             * Selected items
             *
             * @type {Array.<AutocompleteItem>}
             */
            selectedItems: this.value,

            /**
             * Current label of the input
             *
             * @type {String}
             */
            currentLabel: label,

            /**
             * The label before the new input
             *
             * @type {String}
             */
            previousLabel: label,

            /**
             * Wether the textfield is focused or not
             *
             * @type {Boolean}
             */
            focused: false,

            /**
             * List of suggestions
             *
             * An empty array means that we received an empty list of suggestions.
             * Null means that we do not have a list of suggestions.
             *
             * @type {Array.<AutocompleteItem>|null}
             */
            suggestions: null,

            /**
             * Properties of the suggestion HTTP request
             */
            suggestionRequest: {
                /** @type {Timeout|null} */
                timeout: null,

                /** @type {Promise|null} */
                promise: null,

                /** @type {Boolean} */
                pending: false,

                /** @type {String|null} */
                error: null
            },

            /**
             * Index of the currently highlighted item
             *
             * Null, if the keyboard navigation is not triggered yet.
             *
             * @type {Number|null}
             */
            indexOfHighligtedItem: null
        };
    },

    computed: {
        /**
         * Ids of selected items
         *
         * @returns {Array.<String|Number>}
         */
        selectedIds() {
            return this.selectedItems.map(({ id }) => id);
        },

        /**
         * List of non-empty categories, in alphabetic order
         *
         * @returns {Array.<string>}
         */
        nonEmptyCategories() {
            return Object.keys(this.unselectedSuggestions).sort();
        },

        /**
         * List of unselected suggestions, grouped by categories
         *
         * Please note that a special category can be created, named 'extra'.
         *
         * @returns {Object.<string,Array.<AutocompleteItem>>}
         */
        unselectedSuggestions() {
            if (this.suggestions === null) {
                return {};
            }

            // regular suggestions, grouped by category
            let empty = true;
            const suggestions = this.suggestions.reduce((acc, suggestion) => {
                if (
                    this.allowMultiple &&
                    this.selectedIds.indexOf(suggestion.id) !== -1
                ) {
                    return acc;
                }
                if (!acc[suggestion.category]) {
                    acc[suggestion.category] = [];
                }

                acc[suggestion.category].push(suggestion);
                empty = false;
                return acc;
            }, {});

            // extra suggestions
            if (this.createNew !== null) {
                suggestions._ = [
                    {
                        id: "new",
                        label: `Créer "${this.currentLabel}"`,
                        category: "",
                        data: {},
                        isExtra: true
                    }
                ];
            } else if (empty) {
                suggestions._ = [
                    {
                        id: "empty",
                        label: "Aucun résultat",
                        category: "",
                        data: {},
                        isExtra: true
                    }
                ];
            }

            return suggestions;
        },

        /**
         * Ordered list of unselected suggestions
         *
         * @returns {Array.<AutocompleteItem>}
         */
        unselectedSuggestionsFlat() {
            return this.nonEmptyCategories.reduce(
                (acc, category) => [
                    ...acc,
                    ...this.unselectedSuggestions[category]
                ],
                []
            );
        },

        /**
         * Indicates whether the list of unselected suggestions is empty
         *
         * Please note that extra suggestions are not taken into account here.
         *
         * @returns {Boolean}
         */
        isSuggestionListEmpty() {
            const list = this.unselectedSuggestionsFlat;
            if (list.length > 1) {
                return false;
            }

            if (list.length === 0) {
                return true;
            }

            return list[0].isExtra === true && list[0].id === "empty";
        },

        /**
         * Id of the currently highlighted item
         *
         * @returrns {String|Number|null}
         */
        idOfHighlightedItem() {
            if (this.indexOfHighligtedItem === null) {
                return null;
            }

            if (this.indexOfHighligtedItem < 0) {
                return null;
            }

            if (
                this.indexOfHighligtedItem >=
                this.unselectedSuggestionsFlat.length
            ) {
                return null;
            }

            return this.unselectedSuggestionsFlat[this.indexOfHighligtedItem]
                .id;
        }
    },

    watch: {
        // two-way binding
        value() {
            this.selectedItems = this.value;
        },

        disabled() {
            this.reset();
        }
    },

    mounted() {
        document.addEventListener("click", this.checkOutsideClick);
    },

    destroyed() {
        document.removeEventListener("click", this.checkOutsideClick);
    },

    methods: {
        /**
         * Handles a new input in the textfield
         *
         * Basically: if the content of the textfield changed, abort
         * the pending or scheduled suggestion request, and schedule
         * a new one.
         * Otherwise, do nothing.
         *
         * @returns {undefined}
         */
        onType() {
            this.positionSpinner();

            // ignore key inputs that did not cause a change in the label
            if (this.currentLabel === this.previousLabel) {
                return;
            }

            this.previousLabel = this.currentLabel;

            // schedule a suggestion request
            this.resetSuggestions();
            this.scheduleSuggestionRequest();
        },

        /**
         * Handles a new navigation input in the textfield
         *
         * Basically:
         * - if an arrow key has been pressed, navigate through the suggestions
         * - if the enter key has been pressed, select the currently highligted suggestion
         * - otherwise, reset the navigation
         *
         * @param {KeyboardEvent} event
         *
         * @returns {undefined}
         */
        onNavigation(event) {
            if (this.isSuggestionListEmpty) {
                this.indexOfHighligtedItem = null;
                return;
            }

            if (event.keyCode === 38) {
                // up arrow (= previous suggestion)
                if (this.indexOfHighligtedItem - 1 < 0) {
                    this.indexOfHighligtedItem = null;
                } else {
                    this.indexOfHighligtedItem -= 1;
                }
            } else if (event.keyCode === 40) {
                // down arrow (= next suggestion)
                if (this.unselectedSuggestionsFlat.length > 0) {
                    if (this.indexOfHighligtedItem === null) {
                        this.indexOfHighligtedItem = 0;
                    } else {
                        this.indexOfHighligtedItem = Math.min(
                            this.unselectedSuggestionsFlat.length - 1,
                            this.indexOfHighligtedItem + 1
                        );
                    }
                }
            } else if (event.keyCode === 13) {
                // key 'enter' (= select current suggestion)
                if (this.indexOfHighligtedItem !== null) {
                    this.selectItem(
                        this.unselectedSuggestionsFlat[
                            this.indexOfHighligtedItem
                        ]
                    );
                    this.$refs.input.focus();
                }
            } else {
                this.indexOfHighligtedItem = null;
            }
        },

        /**
         * Schedules a new suggestion request
         *
         * @returns {undefined}
         */
        scheduleSuggestionRequest() {
            this.cancelSuggestionRequest();
            this.suggestionRequest.timeout = setTimeout(
                this.requestSuggestions,
                DEFAULT_TIMEOUT
            );
        },

        /**
         * Cancels the pending or scheduled suggestion request
         *
         * @returns {undefined}
         */
        cancelSuggestionRequest() {
            // if a request is pending: abort!
            if (this.suggestionRequest.promise !== null) {
                this.suggestionRequest.promise.abort();
            }

            this.resetSuggestionPromise();

            // if a request is scheduled: clear!
            if (this.suggestionRequest.timeout !== null) {
                clearTimeout(this.suggestionRequest.timeout);
                this.suggestionRequest.timeout = null;
            }
        },

        /**
         * Resets the status of the suggestion request promise
         *
         * @returns {undefined}
         */
        resetSuggestionPromise() {
            this.suggestionRequest.promise = null;
            this.suggestionRequest.pending = false;
            this.suggestionRequest.error = null;
        },

        /**
         * Performs a suggestion request
         *
         * @returns {undefined}
         */
        requestSuggestions() {
            if (!this.canLabelTriggerARequest(this.currentLabel)) {
                return;
            }

            if (this.suggestionRequest.promise !== null) {
                this.cancelSuggestionRequest();
            }

            this.suggestionRequest.pending = true;
            this.suggestionRequest.promise = this.autocompleter(
                this.currentLabel
            );
            this.suggestionRequest.promise
                .then(this.setSuggestions)
                .catch(this.handleSuggestionFailure);
        },

        /**
         * Sets a new list of suggestions
         *
         * @param {Array.<AutocompleteItem>} suggestions
         *
         * @returns {undefined}
         */
        setSuggestions(suggestions) {
            this.resetSuggestionPromise();

            // do not show suggestions if the textfield is not focused anymore
            if (!this.focused) {
                return;
            }

            this.suggestions = suggestions;
            if (!this.isSuggestionListEmpty) {
                this.indexOfHighligtedItem = 0;
            }
        },

        /**
         * Handles a failure of the suggestion request
         *
         * @param {Object} error
         *
         * @returns {undefined}
         */
        handleSuggestionFailure(error) {
            let errorDetails = "erreur inconnue";
            if (error && error.user_message) {
                errorDetails = error.user_message;
            }

            this.resetSuggestionPromise();
            this.suggestionRequest.error = `Une erreur est survenue : ${errorDetails}`;
        },

        /**
         * Checks if the given label should lead to a suggestion request
         *
         * @param {String} label
         *
         * @returns {Boolean}
         */
        canLabelTriggerARequest(label) {
            return label !== "";
        },

        /**
         * Clears the textfield
         *
         * @returns {undefined}
         */
        clearLabel() {
            this.cancelSuggestionRequest();
            this.setLabel("");

            if (this.allowMultiple === false) {
                this.selectedItems = [];
                this.$emit("input", this.selectedItems);
            }
        },

        /**
         * Resets the textfield to initial state
         *
         * @returns {undefined}
         */
        reset() {
            this.cancelSuggestionRequest();
            this.$refs.input.blur();

            if (this.allowMultiple || this.selectedItems.length !== 1) {
                this.setLabel("");
            } else {
                this.setLabel(this.selectedItems[0].label);
            }
        },

        /**
         * Resets the list of suggestions
         */
        resetSuggestions() {
            this.suggestions = null;
        },

        /**
         * Sets a new content for the textfield
         *
         * @param {String} label
         *
         * @returns {undefined}
         */
        setLabel(label) {
            this.currentLabel = label;
            this.previousLabel = label;
            this.resetSuggestions();
        },

        /**
         * Checks if the given click event comes from outside the input
         *
         * @param {MouseEvent} event
         *
         * @returns {undefined}
         */
        checkOutsideClick(event) {
            const refs = [
                "prefixIcon",
                "input",
                "suffixIcon",
                "suggestionContainer"
            ];

            // if the click does not come from the input, reset the field
            if (
                !refs.some(
                    ref =>
                        this.$refs[ref] &&
                        this.$refs[ref].contains(event.target)
                )
            ) {
                this.reset();
            }
        },

        /**
         * Adds the given item to the selection
         *
         * @param {AutocompleteItem} item
         *
         * @returns {undefined}
         */
        selectItem(item) {
            // custom behavior for 'extra' items
            if (item.isExtra === true) {
                if (item.id === "empty") {
                    return;
                }

                if (item.id === "new") {
                    this.createNew(this.currentLabel);
                    this.resetSuggestions();
                }

                return;
            }

            if (this.allowMultiple === false) {
                this.selectedItems = [item];
                this.reset();
            } else {
                // check if the item already is in the selection
                if (this.selectedItems.some(({ id }) => item.id === id)) {
                    return;
                }

                this.selectedItems.push(item);
            }

            this.$emit("input", this.selectedItems);
        },

        /**
         * Removes the given item from the selection
         *
         * @param {AutocompleteItem} item
         *
         * @returns {undefined}
         */
        unselectItem(item) {
            const index = this.selectedItems.findIndex(
                ({ id }) => item.id === id
            );
            if (index === -1) {
                return;
            }

            this.selectedItems.splice(index, 1);
            this.$emit("input", this.selectedItems);
        },

        /**
         * Positions the spinner so that it appears just after the end of the label
         *
         * @returns {undefined}
         */
        positionSpinner() {
            this.$refs.spinner.style.marginLeft = 0;
            const maxMargin = this.$refs.input.clientWidth;
            this.$refs.spinner.offsetLeft - this.$refs.spinner.offsetWidth;
            this.$refs.spinner.style.marginLeft = `${Math.min(
                this.$refs.measure.clientWidth,
                maxMargin
            )}px`;
        }
    }
};

/**
 * Please note that the property 'data' is completely useless for this component itself,
 * but it might be used by the parent component.
 *
 * @typedef {Object} AutocompleteItem
 * @property {String|Number} id       Unique identifier for that item
 * @property {String}        label    The string that should appear in the textfield
 * @property {String}        category A category identifier. Used to group suggestions by category
 * @property {Object}        [data]   Any additional data related to the item.
 */
