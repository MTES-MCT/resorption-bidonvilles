import '../module_alias';
import { randomInt, randomBytes } from 'node:crypto';

/**
 * A set of functions that can generate random values of a certain type
 *
 * @type {Object.<string, Function>}
 */
const generators = {
    date() {
        return new Date();
    },
    string() {
        return randomBytes(16).toString('hex');
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
        return randomInt(0, 1990);
    },
    boolean() {
        return randomInt(0, 2) === 1;
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

    return values[randomInt(0, values.length)];
}

/**
 * Returns all types that can be generated, except from the passed ones
 *
 * @param {Array.<string>} types The forbidden types
 *
 * @returns {Array.<string>}
 */
function getAllTypesOtherThan(types) {
    return Object.keys(generators).filter(type => !types.includes(type));
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
globalThis.generate = (types) => {
    if (types === undefined) {
        return {
            not(argTypes) {
                return getRandomValue(getAllTypesOtherThan(Array.isArray(argTypes) ? argTypes : [argTypes]));
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
