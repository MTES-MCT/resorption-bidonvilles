export default function () {
    return import.meta.env.VITE_BLOG_URL || "${VITE_BLOG_URL}";
}
