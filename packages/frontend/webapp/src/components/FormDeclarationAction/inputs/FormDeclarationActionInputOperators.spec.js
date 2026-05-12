import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, ref, nextTick } from "vue";

// --- Référence mutable partagée entre tous les tests ---
// Chaque test configure `mockUsers` avant de monter le composant.
const mockOperatorsValue = ref({ organizations: [], users: [] });

// vi.mock est hissé statiquement par Vitest : on peut cibler le ref partagé.
// On préserve les autres exports de vee-validate (ErrorMessage notamment, utilisé
// par les composants de @resorptionbidonvilles/ui).
vi.mock("vee-validate", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useField: vi.fn(() => ({ value: mockOperatorsValue })),
    };
});

// On importe le composant APRÈS le mock pour que le module résolu utilise le mock.
const { default: FormDeclarationActionInputOperators } = await import(
    "./FormDeclarationActionInputOperators.vue"
);

// --- Stubs des composants enfants ---

const InputUsersStub = defineComponent({
    name: "InputUsers",
    template: "<div data-testid='input-users'></div>",
});

const DsfrRadioButtonSetStub = defineComponent({
    name: "DsfrRadioButtonSet",
    props: ["modelValue", "options", "legend", "name"],
    emits: ["update:modelValue"],
    template: `
        <fieldset data-testid="radio-group">
            <legend>{{ legend }}</legend>
            <div
                v-for="option in options"
                :key="option.value"
                :data-testid="'radio-option-' + option.value"
            >
                <input
                    type="radio"
                    :value="option.value"
                    :checked="modelValue === option.value"
                    @change="$emit('update:modelValue', option.value)"
                />
                <label>{{ option.label }}</label>
            </div>
        </fieldset>
    `,
});

// --- Helper de montage ---

const mountComponent = () =>
    mount(FormDeclarationActionInputOperators, {
        global: {
            stubs: {
                InputUsers: InputUsersStub,
                DsfrRadioButtonSet: DsfrRadioButtonSetStub,
            },
        },
    });

// --- Helper pour initialiser les users ---

const setUsers = (users) => {
    mockOperatorsValue.value = { organizations: [], users };
};

describe("FormDeclarationActionInputOperators", () => {
    beforeEach(() => {
        setUsers([]);
    });

    describe("0 opérateur", () => {
        it("ne rend pas le radio group", async () => {
            setUsers([]);
            const wrapper = mountComponent();
            await nextTick();

            expect(wrapper.find('[data-testid="radio-group"]').exists()).toBe(false);
        });
    });

    describe("1 opérateur", () => {
        it("ne rend pas le radio group", async () => {
            setUsers([{ id: 1, label: "Alice Martin", is_principal: false }]);
            const wrapper = mountComponent();
            await nextTick();

            expect(wrapper.find('[data-testid="radio-group"]').exists()).toBe(false);
        });

        it("force is_principal=true sur l'unique opérateur après montage", async () => {
            const users = [{ id: 1, label: "Alice Martin", is_principal: false }];
            setUsers(users);
            mountComponent();
            await nextTick();

            expect(users[0].is_principal).toBe(true);
        });
    });

    describe("filtrage des utilisateurs désactivés", () => {
        it("2 actifs + 1 désactivé → radio rendu avec 2 options seulement", async () => {
            setUsers([
                { id: 1, label: "Alice Martin", is_principal: false },
                { id: 2, label: "Utilisateur Désactivé", is_principal: false },
                { id: 3, label: "Bob Dupont", is_principal: false },
            ]);
            const wrapper = mountComponent();
            await nextTick();

            const radioGroup = wrapper.findComponent(DsfrRadioButtonSetStub);
            expect(radioGroup.exists()).toBe(true);
            expect(radioGroup.props("options")).toHaveLength(2);
            expect(radioGroup.props("options").map((o) => o.value)).toEqual([1, 3]);
        });

        it("1 actif + 1 désactivé → radio masqué, actif auto-marqué", async () => {
            const users = [
                { id: 1, label: "Alice Martin", is_principal: false },
                { id: 2, label: "Utilisateur Désactivé", is_principal: false },
            ];
            setUsers(users);
            const wrapper = mountComponent();
            await nextTick();

            expect(wrapper.find('[data-testid="radio-group"]').exists()).toBe(false);
            expect(users[0].is_principal).toBe(true);
            expect(users[1].is_principal).toBe(false); // désactivé non auto-marqué
        });

        it("2 actifs + 1 désactivé en tête sans is_principal → 1er actif auto-marqué", async () => {
            const users = [
                { id: 1, label: "Utilisateur Désactivé", is_principal: false },
                { id: 2, label: "Bob Dupont", is_principal: false },
                { id: 3, label: "Claire Durand", is_principal: false },
            ];
            setUsers(users);
            mountComponent();
            await nextTick();

            expect(users[0].is_principal).toBe(false); // désactivé reste false même en tête de liste
            expect(users[1].is_principal).toBe(true); // premier actif auto-marqué
            expect(users[2].is_principal).toBe(false);
        });

        it("sélection explicite du 2ème actif via le radio désactive les autres", async () => {
            const users = [
                { id: 1, label: "Alice Martin", is_principal: true },
                { id: 2, label: "Utilisateur Désactivé", is_principal: false },
                { id: 3, label: "Claire Durand", is_principal: false },
            ];
            setUsers(users);
            const wrapper = mountComponent();
            await nextTick();

            const radioGroup = wrapper.findComponent(DsfrRadioButtonSetStub);
            radioGroup.vm.$emit("update:modelValue", 3);
            await nextTick();

            expect(users[0].is_principal).toBe(false);
            expect(users[1].is_principal).toBe(false); // désactivé reste false
            expect(users[2].is_principal).toBe(true);
        });
    });

    describe("2 opérateurs ou plus", () => {
        it("rend le radio group", async () => {
            setUsers([
                { id: 1, label: "Alice Martin", is_principal: true },
                { id: 2, label: "Bob Dupont", is_principal: false },
            ]);
            const wrapper = mountComponent();
            await nextTick();

            expect(wrapper.find('[data-testid="radio-group"]').exists()).toBe(true);
        });

        it("pré-sélectionne le user déjà marqué is_principal", async () => {
            setUsers([
                { id: 1, label: "Alice Martin", is_principal: false },
                { id: 2, label: "Bob Dupont", is_principal: true },
            ]);
            const wrapper = mountComponent();
            await nextTick();

            const radioGroup = wrapper.findComponent(DsfrRadioButtonSetStub);
            expect(radioGroup.props("modelValue")).toBe(2);
        });

        it("pré-sélectionne le premier user si aucun n'est marqué is_principal", async () => {
            setUsers([
                { id: 10, label: "Claire Durand", is_principal: false },
                { id: 20, label: "Denis Moreau", is_principal: false },
            ]);
            const wrapper = mountComponent();
            await nextTick();

            const radioGroup = wrapper.findComponent(DsfrRadioButtonSetStub);
            expect(radioGroup.props("modelValue")).toBe(10);
        });

        it("met à jour is_principal sur tous les users lors d'un changement de sélection", async () => {
            const users = [
                { id: 1, label: "Alice Martin", is_principal: true },
                { id: 2, label: "Bob Dupont", is_principal: false },
                { id: 3, label: "Claire Durand", is_principal: false },
            ];
            setUsers(users);
            const wrapper = mountComponent();
            await nextTick();

            // Simuler la sélection du deuxième user via le stub
            const radioGroup = wrapper.findComponent(DsfrRadioButtonSetStub);
            radioGroup.vm.$emit("update:modelValue", 2);
            await nextTick();

            expect(users[0].is_principal).toBe(false);
            expect(users[1].is_principal).toBe(true);
            expect(users[2].is_principal).toBe(false);
        });
    });
});
