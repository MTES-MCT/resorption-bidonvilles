export default function () {
    console.log("getBlogUrl is", import.meta.env.VITE_BLOG_URL);
    return import.meta.env.VITE_BLOG_URL || "";
}
