import { json } from '@sveltejs/kit';
import { getPosts, createPost } from '$lib/posts';

export async function GET() {
    const memos = await getPosts();
    return json(memos);
}

export async function POST({ request, getClientAddress }) {
    try {
        const { title, content } = await request.json();
        const ip = getClientAddress();
        const newPost = await createPost(title, content, ip);
        return json(newPost, { status: 201 });
    } catch (error) {
        if (error.message === 'DUPLICATE_TITLE') {
            return json({ message: '이미 같은 제목의 메모가 존재합니다.' }, { status: 409 });
        }
        console.error('Error creating post:', error);
        return json({ message: '메모를 생성하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}