import { json } from '@sveltejs/kit';
import { getPosts, createPost } from '$lib/posts';
import { z } from 'zod';

// Define the schema for creating a post
const createPostSchema = z.object({
    title: z.string().min(1, { message: '제목을 입력해주세요.' }).max(200, { message: '제목은 200자를 넘을 수 없습니다.' }),
    content: z.string().optional(), // 내용은 비어있을 수 있음
});

export async function GET() {
    const memos = await getPosts();
    return json(memos);
}

export async function POST({ request, getClientAddress, locals }) {
    if (!locals.isAdmin) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = createPostSchema.safeParse(body);

    if (!result.success) {
        // Return a 400 Bad Request with the validation errors
        return json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    try {
        const ip = getClientAddress();
        // Use the validated data
        const newPost = await createPost(result.data.title, result.data.content || '', ip);
        return json(newPost, { status: 201 });
    } catch (error) {
        if (error.message === 'DUPLICATE_TITLE') {
            return json({ message: '이미 같은 제목의 메모가 존재합니다.' }, { status: 409 });
        }
        console.error('Error creating post:', error);
        return json({ message: '메모를 생성하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}