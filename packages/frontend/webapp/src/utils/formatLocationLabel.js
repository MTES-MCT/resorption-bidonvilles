export default function ({ code, name }) {
    return code.length === 5 ? `(${code.slice(0, 2)}) ${name}` : name;
}
