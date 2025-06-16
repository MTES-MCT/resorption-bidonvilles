export default (input: string): boolean => {
    const dangerousCharactersRegex = /[;'"\\%]/;
    return !dangerousCharactersRegex.test(input);
};
