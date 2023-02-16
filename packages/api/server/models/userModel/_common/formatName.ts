type UserName = {
    firstName?: string,
    lastName?: string,
    first_name?: string,
    last_name?: string
};

function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default (user: UserName): string => {
    let { firstName, lastName } = user;
    if (!firstName && user.first_name) {
        ({ first_name: firstName, last_name: lastName } = user);
    }

    return `${firstName.split(' ').map(ucfirst).join(' ')} ${lastName.toUpperCase()}`;
};
