// Common classes between TextInput / TextArea / Select
export default function getInputClasses(variant, inputOptions = {}) {
    const { error, prefixIcon, suffixIcon, clear, size, width } = inputOptions;

    return {
        state: [
            "bg-G200 border-b-2 border-black rounded rounded-b-none py-2 placeholder-gray-700",
            width || "w-full",
            error && "border-error",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10"
        ],
        classic: [
            "border-1 border-G200 rounded-md py-2 px-4 outline-none focus:border-info placeholder-gray-700",
            width || "w-full",
            error && "border-error",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10"
        ],
        default: [
            "border-2 border-G500 py-1 px-2 outline-none focus:border-info hover:border-blue400 placeholder-gray-700",
            width || "w-full",
            size === "sm" ? "text-xs" : "",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10",
            clear && "pr-20"
        ],
        filter: [
            "border border-primary px-2 rounded outline-none leading-7 hover placeholder-gray-700",
            width || "w-full",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10"
        ],
        minimal: [
            "border border-white py-1 px-1 outline-none focus:border-info hover:border-blue400 placeholder-gray-700",
            width || "",
            size === "sm" ? "text-xs" : "",
        ],
    }[variant];
}
