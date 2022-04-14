// Common classes between TextInput / TextArea / Select
export default function getInputClasses(variant, inputOptions = {}) {
    const { error, prefixIcon, suffixIcon, size } = inputOptions;

    return {
        state: [
            "bg-G200 border-b-2 border-black rounded rounded-b-none w-full py-2 ",
            error && "border-error",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10"
        ],
        classic: [
            "border-1 border-G200 rounded-md w-full py-2 px-4 outline-none focus:border-primary",
            error && "border-error",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10"
        ],
        default: [
            "border-2 border-blue200 py-1 px-4 w-full outline-none focus:border-primary hover:border-inputHover",
            size === "sm" ? "text-xs" : "",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10"
        ]
    }[variant];
}
