import { json } from '@sveltejs/kit';
import { getPosts, createPost } from '$lib/posts';

export async function GET() {
    const memos = getPosts();
    return json(memos);
}

export async function POST({ request, getClientAddress }) {
    const { title, content } = await request.json();
    const ip = getClientAddress();
    const newPost = createPost(title, content, ip);
    return json(newPost, { status: 201 });
}