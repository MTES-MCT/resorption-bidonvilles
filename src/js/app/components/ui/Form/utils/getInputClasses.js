// Common classes between TextInput / TextArea / Select
export default function getInputClasses(variant, inputOptions) {
    const { error, prefixIcon, suffixIcon } = inputOptions;

    return {
        state: [
            "bg-G200 border-b-2 border-black rounded rounded-b-none w-full py-2 ",
            error && "border-error",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10"
        ],
        default: [
            "border-2 border-G200 rounded-md w-full py-2 px-4 outline-none focus:border-primary",
            error && "border-error",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10"
        ]
    }[variant];
}
