module.exports = function checkPassword(str) {
    if (!str) {
        return ['Le mot de passe est obligatoire'];
    }

    const errors = [];
    if (str.length < 12) {
        errors.push('Le mot de passe doit comporter 12 caractères ou plus');
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
};
