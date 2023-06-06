
export function serialized(override = {}) {
    const defaultObj = {
        entity: 'shantytown',
        date: 1,
    };

    return Object.assign(defaultObj, override);
}

export default serialized;
