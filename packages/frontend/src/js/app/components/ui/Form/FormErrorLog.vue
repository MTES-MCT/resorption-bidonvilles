<template>
    <div v-if="mainError || hasErrors" class="bg-red200 p-6">
        <p v-if="mainError">{{ mainError }}</p>
        <p v-else>Le formulaire comprend des erreurs :</p>

        <ul class="mt-4" v-if="hasErrors">
            <li
                v-for="(error, inputId) in errors"
                :key="inputId"
                v-show="error.length"
            >
                <router-link
                    class="link"
                    :to="{ hash: inputId }"
                    v-if="linksToError === true"
                    >{{ error[0] }}</router-link
                >
                <span v-else>{{ error[0] }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        mainError: {
            type: String,
            required: false,
            default() {
                return null;
            }
        },
        errors: {
            type: Object,
            required: false,
            default() {
                return {};
            }
        },
        linksToError: {
            type: Boolean,
            required: false,
            default: true
        }
    },

    computed: {
        hasErrors() {
            return (
                Object.values(this.errors).filter(err => err.length).length > 0
            );
        }
    }
};
</script>
