import NavBar from '#app/layouts/navbar/navbar.vue';
import OperatorContact from '#app/components/operatorContact/operatorContact.vue';
import { create } from '#helpers/api/operator';

export default {
    components: {
        NavBar,
        OperatorContact,
    },

    data() {
        return {
            loading: false,
            form: {
                mainError: null,
                errors: {},
                input: {
                    name: '',
                    contacts: [],
                },
            },
        };
    },

    computed: {
        formData() {
            return {
                name: this.form.input.name,
                contacts: this.form.input.contacts.map(({ data }) => data),
            };
        },
    },

    methods: {
        submit() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.mainError = null;
            this.errors = {};

            create(this.formData)
                .then(() => {
                    this.loading = false;

                    this.$notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Opérateur créé',
                        text: `L'opérateur ${this.form.input.name} a bien été créé`,
                    });

                    this.$router.push('/liste-des-operateurs');
                })
                .catch(({ user_message: mainError, fields: errors }) => {
                    this.form.mainError = mainError || null;
                    this.form.errors = errors || {};
                    this.loading = false;
                });
        },

        addContact() {
            if (this.loading === true) {
                return;
            }

            this.form.input.contacts.push({
                data: {},
            });
        },

        removeContact(index) {
            if (this.loading === true) {
                return;
            }

            this.form.input.contacts.splice(index, 1);
        },
    },
};
