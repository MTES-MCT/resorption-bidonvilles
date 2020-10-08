// Common classes between TextInput / TextArea / Select
export default function getInputClasses(variant, error) {
    return {
        state: ['bg-G200 border-b-2 border-black rounded rounded-b-none w-full py-2 px-4', error && 'border-error'],
        default: ['border-2 border-G200 rounded-md w-full py-2 px-4 outline-none focus:border-primary'],
    }[variant];
}
