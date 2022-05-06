export default (user) => {
    let { firstName, lastName } = user;
    if (!firstName && user.first_name) {
        ({ first_name: firstName, last_name: lastName } = user);
    }

    return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.toUpperCase()}`;
};
