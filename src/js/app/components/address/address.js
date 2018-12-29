import { autocomplete } from '#helpers/addressHelper';

/**
 * Delay before triggering an autocomplete, in milliseconds
 *
 * @const {number}
 */
const TYPING_TIMEOUT = 200;

/**
 * Minimum length of the user's query before triggering an autocomplete
 *
 * @const {number}
 */
const TYPING_MIN = 5;

export default {
    props: {
        value: Object,
        autofocus: Boolean,
        placeholder: String,
    },
    data() {
        return {
            pendingRequest: null,
            typingTimeout: null,
            suggestions: [],
            coordinates: (this.value !== null && this.value.coordinates) || null,
            query: (this.value !== null && this.value.label) || '',
            previousQuery: '',
            focused: false,
            indexOfHighlightedSuggestion: null,
        };
    },
    mounted() {
        document.addEventListener('click', this.checkOutsideClick);
    },
    beforeDestroy() {
        if (this.typingTimeout !== null) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
    },
    destroyed() {
        document.removeEventListener('click', this.checkOutsideClick);
    },
    methods: {
        onTyping() {
            // ignore key inputs that did not cause a change in the value of the query
            if (this.previousQuery === this.query) {
                return;
            }

            this.previousQuery = this.query;
            if (this.typingTimeout !== null) {
                clearTimeout(this.typingTimeout);
            }

            this.coordinates = null;
            this.$emit('input', null);
            this.setSuggestions([]);
            this.indexOfHighlightedSuggestion = null;
            this.typingTimeout = setTimeout(this.autocomplete, TYPING_TIMEOUT);
        },
        onFocus() {
            this.focused = true;
        },
        onBlur() {
            this.focused = false;

            if (this.pendingRequest !== null) {
                this.pendingRequest.abort();
            }

            this.setSuggestions([]);
        },
        onNavigation(event) {
            if (event.keyCode === 38) { // up arrow (= previous suggestion)
                if (this.indexOfHighlightedSuggestion - 1 < 0) {
                    this.indexOfHighlightedSuggestion = null;
                } else {
                    this.indexOfHighlightedSuggestion = this.indexOfHighlightedSuggestion - 1;
                }
            } else if (event.keyCode === 40) { // down arrow (= next suggestion)
                if (this.suggestions.length > 0) {
                    if (this.indexOfHighlightedSuggestion === null) {
                        this.indexOfHighlightedSuggestion = 0;
                    } else {
                        this.indexOfHighlightedSuggestion = Math.min(this.suggestions.length - 1, this.indexOfHighlightedSuggestion + 1);
                    }
                }
            } else if (event.keyCode === 13) { // key 'enter' (= select current suggestion)
                if (this.indexOfHighlightedSuggestion !== null) {
                    this.onSelect(this.suggestions[this.indexOfHighlightedSuggestion]);
                }
            } else {
                this.indexOfHighlightedSuggestion = null;
            }
        },
        onSuggestionClick(suggestion) {
            this.onSelect(suggestion);
        },
        onSelect(value) {
            const { label, coordinates } = value;
            this.$emit('input', value);
            this.setSuggestions([]);
            this.coordinates = coordinates;
            this.query = label;
            this.previousQuery = label;
        },
        autocomplete() {
            if (this.pendingRequest !== null) {
                this.pendingRequest.abort();
            }

            if (this.query.length < TYPING_MIN || this.focused !== true) {
                return;
            }

            this.pendingRequest = autocomplete(this.query);
            this.pendingRequest
                .then((suggestions) => {
                    if (this.focused === true) {
                        this.setSuggestions(suggestions);
                    }
                })
                .catch(() => {
                    this.pendingRequest = null;
                });
        },
        checkOutsideClick(event) {
            if (!this.$el.contains(event.target)) {
                this.setSuggestions([]);
            }
        },
        setSuggestions(suggestions) {
            this.suggestions = suggestions;

            if (this.suggestions.length > 0) {
                this.indexOfHighlightedSuggestion = 0;
            } else {
                this.indexOfHighlightedSuggestion = null;
            }
        },
    },
};
