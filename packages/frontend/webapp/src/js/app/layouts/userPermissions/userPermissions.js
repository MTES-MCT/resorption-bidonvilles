/**
 * Matching between item types and fontawesome icones
 *
 * @const {Object.<String,String>}
 */
const TYPES_TO_ICONS = {
    view: "eye",
    edit: "pencil-alt",
    deny: "times"
};

export default {
    props: {
        /**
         * Title of the section
         *
         * @type {String}
         */
        title: {
            type: String,
            required: true
        },

        /**
         * List of items
         *
         * @type {Array.<Array.<UserPermissionItem>>}
         */
        items: {
            type: Array,
            required: true
        }
    },

    computed: {
        /**
         * Merges the different sections of permission items into a single array
         *
         * @param {Array.<Array.<UserPermissionItem>>} permissionItems
         *
         * @returns {Array.<UserPermissionParsedItem>}
         */
        parsedItems() {
            return this.items.reduce((acc, arr) => {
                if (arr.length > 0) {
                    Object.assign(arr[0], { subsection: true });
                }

                return [...acc, ...arr.map(this.resolveIcon)];
            }, []);
        }
    },

    methods: {
        /**
         * Resolves the icon to be used, based on the item's type
         *
         * @param {UserPermissionParsedItem} item
         *
         * @returns {UserPermissionParsedItem}
         */
        resolveIcon(item) {
            return { ...item, icon: TYPES_TO_ICONS[item.type] };
        }
    }
};

/**
 * @typedef {Object} UserPermissionItem
 * @property {String}  type       Either 'view', 'edit', or 'deny'
 * @property {String}  label      Label of the permission (HTML allowed)
 * @property {String}  [comments] Additional line of text below the label (no HTML allowed)
 */

/**
 * @type {UserPermissionItem} UserPermissionParsedItem
 * @property {String}  icon               Name of the fontawesome icon to be used
 * @property {Boolean} [subsection=false] Whether this item is the first one of a subsection of permissions (used for styling)
 */
