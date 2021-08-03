<template>
    <div>
        <div class="font-bold">{{ title }}</div>

        <ul class="list-none">
            <li v-for="(item, index) in parsedItems" :key="item.label">
                <div
                    :class="[
                        'flex items-center',
                        item.subsection && index > 0 ? 'mt-4' : ''
                    ]"
                >
                    <div class="w-6">
                        <Icon
                            :class="[
                                item.type === 'deny'
                                    ? 'text-error'
                                    : 'text-tertiary'
                            ]"
                            :icon="item.icon"
                        />
                    </div>

                    <span
                        v-html="item.label.replace(/%(.+?)%/gi, '<em>$1</em>')"
                    ></span>
                </div>
                <div v-if="item.comments" class="flex items-center">
                    <div class="w-6">
                        <Icon class="text-error" icon="times" />
                    </div>
                    <div>
                        {{ item.comments }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
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
</script>
