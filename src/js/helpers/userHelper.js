/**
 * Sends a login request for the given user
 *
 * Please note that in case of success, a JWT token is stored in the local storage,
 * which is the only way we have to detect wether the current user is logged in
 * or not.
 * @see isLoggedIn()
 *
 * @param {string} email
 * @param {string} password
 *
 * @returns {Promise}
 */
export function login(email, password) {
    const logins = {
        'anis@beta.gouv.fr': 'fabnum',
        'sophie.jacquemont@developpement-durable.gouv.fr': 'fabnum',
        'clement.chapalain@beta.gouv.fr': 'fabnum',
    };

    return new Promise((success, failure) => {
        if (Object.prototype.hasOwnProperty.call(logins, email) && password === logins[email]) {
            localStorage.setItem('auth_token', email);
            success();
        } else {
            failure({
                user_message: 'Identifiants incorrects',
            });
        }
    });
}

/**
 * Logs the user out
 *
 * Basically, all we have to do is remove the token from local storage.
 */
export function logout() {
    localStorage.removeItem('auth_token');
}

/**
 * Checks if the current user is logged in or not
 *
 * This check is only based on the existence of an 'auth_token' entry in the local storage,
 * NOT on its validity.
 * This should not cause safety issues as the backend should always validate that token before
 * accepting any requests.
 *
 * @returns {boolean}
 */
export function isLoggedIn() {
    return localStorage.getItem('auth_token') !== null;
}

/**
 * This a navigation before-enter guard that ensures the current user is logged-in
 *
 * If the user is logged-in, perform the routing as requested.
 * Redirect to the home, otherwise.
 *
 * Please @see https://router.vuejs.org/guide/advanced/navigation-guards.html#per-route-guard
 * for more information about VueJS navigation guards.
 *
 * @param {Route}    to   The target Route Object being navigated to
 * @param {Route}    from The current route being navigated away from
 * @param {Function} next Resolver
 */
export function checkLogin(to, from, next) {
    if (isLoggedIn() === true) {
        next();
    } else {
        next('/');
    }
}

/**
 * Sends a sign-up request with the given credentials
 *
 * @param {string} email
 * @param {string} description
 *
 * @returns {Promise}
 */
export function signup(email, description) {
    return new Promise((success, failure) => {
        setTimeout(() => {
            if (email !== '' && description !== '') {
                success();
            } else {
                failure({
                    user_message: 'Données incorrectes !',
                    details: {
                        email: 'Ce champ est obligatoire',
                        description: 'Ce champ est obligatoire',
                    },
                });
            }
        }, 1000);
    });
}
