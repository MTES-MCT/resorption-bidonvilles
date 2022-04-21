require('../module_alias');

/**
 * A set of functions that can generate random values of a certain type
 *
 * @type {Object.<string, Function>}
 */
const generators = {
    string() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    stringdate() {
        return (new Date()).toString();
    },
    null() {
        return null;
    },
    undefined() {
        return undefined;
    },
    array() {
        return [];
    },
    object() {
        return {};
    },
    function() {
        return () => { };
    },
    number() {
        return Math.round(Math.random() * 1989);
    },
    boolean() {
        return Math.round(Math.random()) === 1;
    },
};

/**
 * Returns a random value
 *
 * @param {Array.<string>} types The type of values that can be generated
 *
 * @returns {Object}
 */
function getRandomValue(types) {
    const values = types.map(type => generators[type]());

    return values[Math.round(Math.random() * (values.length - 1))];
}

/**
 * Returns all types that can be generated, except from the passed ones
 *
 * @param {Array.<string>} types The forbidden types
 *
 * @returns {Array.<string>}
 */
function getAllTypesOtherThan(types) {
    return Object.keys(generators).filter(type => types.indexOf(type) === -1);
}

/**
 * Allows to generate a random value
 *
 * This function allows you to either:
 * - generate a random value of a specific type, by using the "types" argument
 * - generate a random value that is NOT of a specific type, by letting the "types" argument undefined, and using the "not" function returned
 *
 * I am not a fan of currying, but I believe it makes unit tests clearer, so let's say it is
 * an exception.
 *
 * @param {string|Array.<string>|undefined} [types] The type of values that can be generated (the type 'any' matches all available types)
 *
 * @returns {Object|Object.<Function>} Either your value, or a "not" function
 */
global.generate = (types) => {
    if (types === undefined) {
        return {
            not(types) {
                return getRandomValue(getAllTypesOtherThan(Array.isArray(types) ? types : [types]));
            },
        };
    }

    let arrTypes;
    if (types === 'any') {
        arrTypes = Object.keys(generators);
    } else {
        arrTypes = Array.isArray(types) ? types : [types];
    }

    return getRandomValue(arrTypes);
};
