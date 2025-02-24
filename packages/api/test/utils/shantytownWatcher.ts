export default function serialized(override = {}) {
    const defaultObj = {
        user_id: 2,
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean.dupont@gouv.fr',
    };

    return Object.assign(defaultObj, override);
}
