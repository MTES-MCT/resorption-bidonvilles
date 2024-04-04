export default function checkPassword(passwordStr: string, isAdmin: string | boolean | null) {
    if (!passwordStr) {
        return ['Le mot de passe est obligatoire'];
    }

    const errors = [];
    if ((isAdmin && passwordStr.length < 16) || passwordStr.length < 12) {
        errors.push(`Le mot de passe doit comporter ${isAdmin ? 16 : 12} caractères ou plus`);
    }

    if (!(/[a-z]/g).test(passwordStr)) {
        errors.push('Le mot de passe doit comporter une lettre minuscule');
    }

    if (!(/[A-Z]/g).test(passwordStr)) {
        errors.push('Le mot de passe doit comporter une lettre majuscule');
    }

    if (!(/[^a-zA-Z]/g).test(passwordStr)) {
        errors.push('Le mot de passe doit comporter un caractère non alphabétique');
    }

    return errors;
}
