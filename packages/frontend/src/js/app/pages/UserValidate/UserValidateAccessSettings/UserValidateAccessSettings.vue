<template>
    <div>
        <div class="py-4 px-8 bg-G100">
            <div class="text-display-sm mb-4">Paramètres de l'accès</div>

            <div>
                <div class="mb-8">
                    <div class="font-bold">Accès « {{ user.role }} »</div>
                    <div>{{ permission.description }}</div>
                    <div class="text-info">
                        <Icon icon="info-circle" />&nbsp; Les paramètres d'accès
                        sont identiques pour tous les membres d'une structure.
                    </div>
                </div>

                <div class="ml-8">
                    <UserValidatePermissions
                        class="mb-4"
                        v-if="hasPermissionsFor('national')"
                        title="À l’échelle nationale"
                        :items="permission.national_permissions"
                    ></UserValidatePermissions>
                    <UserValidatePermissions
                        v-if="hasPermissionsFor('local')"
                        title="Les droits de l’utilisateur à l’échelle du territoire"
                        :items="permission.local_permissions"
                    ></UserValidatePermissions>
                </div>
            </div>
        </div>
        <div class="py-4 px-8 bg-G300" v-if="availableOptions.length > 0">
            <div>
                <div class="font-bold">Options</div>
                <div class="text-info mb-4">
                    <Icon icon="info-circle" />&nbsp; Les options sont
                    identiques pour tous les membres d'une structure.
                </div>
                <div class="ml-8">
                    <div
                        v-for="(option, optionIndex) in availableOptions"
                        :key="option.id"
                    >
                        <Checkbox
                            type="checkbox"
                            :checkValue="option.id"
                            :label="option.label"
                            :id="`option-${optionIndex}`"
                            :value="checkedOptions"
                            @input="val => $emit('update:checkedOptions', val)"
                            :disabled="user.organization.active"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserValidatePermissions from "./UserValidatePermissions";

export default {
    components: {
        UserValidatePermissions
    },
    props: {
        user: {
            type: Object
        },
        permission: {
            type: Object
        },
        checkedOptions: {
            type: Array
        },
        availableOptions: {
            type: Array
        }
    },
    methods: {
        /**
         * Checks whether the user requires at least one permission for the given level
         *
         * @param {'national'|'local'} level
         *
         * @returns {Boolean}
         */
        hasPermissionsFor(level) {
            return (
                this.permission &&
                this.permission[`${level}_permissions`] &&
                this.permission[`${level}_permissions`].length > 0
            );
        }
    },
    computed: {
        /**
         * Get the allowed options for the current user
         *
         * @returns {Array}
         */
        options() {
            if (this.user === null || !this.permission) {
                return [];
            }

            return this.permission.options;
        }
    }
};
</script>
