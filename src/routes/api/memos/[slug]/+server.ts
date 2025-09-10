
import { json } from '@sveltejs/kit';
import { getRawPost, updatePost, deletePost } from '$lib/posts';
import { z } from 'zod';

// Define the schema for updating a post
const updatePostSchema = z.object({
    title: z.string().min(1, { message: '제목을 입력해주세요.' }).max(200, { message: '제목은 200자를 넘을 수 없습니다.' }),
    content: z.string().optional(),
});

/**
 * 원본 메모 내용을 가져옵니다. (수정용)
 */
export async function GET({ params }) {
    const post = await getRawPost(params.slug);
    if (!post) {
        return json({ message: 'Post not found' }, { status: 404 });
    }
    return json(post);
}

/**
 * 메모를 수정합니다.
 */
export async function PUT({ params, request, locals }) {
    if (!locals.isAdmin) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = updatePostSchema.safeParse(body);

    if (!result.success) {
        return json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const { slug } = params;
    const { title, content } = result.data;

    const updatedPost = await updatePost(slug, title, content || '');

    if (!updatedPost) {
        return json({ message: 'Post not found' }, { status: 404 });
    }

    return json(updatedPost);
}

/**
 * 메모를 삭제합니다.
 */
export async function DELETE({ params, locals }) {
    if (!locals.isAdmin) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { slug } = params;
    const result = await deletePost(slug);

    if (!result.success) {
        // This case might not be reachable if deletePost always succeeds or throws
        return json({ message: 'Post not found or could not be deleted' }, { status: 404 });
    }

    return json({ message: 'Post deleted successfully' });
}
