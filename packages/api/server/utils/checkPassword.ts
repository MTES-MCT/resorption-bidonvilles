export default function checkPassword(str: string, isAdmin: string | boolean | null) {
    if (!str) {
        return ['Le mot de passe est obligatoire'];
    }

    const errors = [];
    if ((isAdmin && str.length < 16) || str.length < 12) {
        errors.push(`Le mot de passe doit comporter ${isAdmin ? 16 : 12} caractères ou plus`);
    }

    if (!(/[a-z]/g).test(str)) {
        errors.push('Le mot de passe doit comporter une lettre minuscule');
    }

    if (!(/[A-Z]/g).test(str)) {
        errors.push('Le mot de passe doit comporter une lettre majuscule');
    }

    if (!(/[^a-zA-Z]/g).test(str)) {
        errors.push('Le mot de passe doit comporter un caractère non alphabétique');
    }

    return errors;
}
