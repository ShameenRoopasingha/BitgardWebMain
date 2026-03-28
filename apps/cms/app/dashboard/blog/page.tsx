import { getBlogPosts } from "@/lib/actions";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const posts = await getBlogPosts();
    return <BlogClient initialPosts={JSON.parse(JSON.stringify(posts))} />;
}
