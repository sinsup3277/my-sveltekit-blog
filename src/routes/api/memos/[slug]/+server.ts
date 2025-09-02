import { json } from '@sveltejs/kit';
import { getRawPost, updatePost, deletePost } from '$lib/posts';

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
export async function PUT({ params, request }) {
    const { slug } = params;
    const { title, content } = await request.json();

    if (!title || !content) {
        return json({ message: 'Title and content are required' }, { status: 400 });
    }

    const updatedPost = await updatePost(slug, title, content);

    if (!updatedPost) {
        return json({ message: 'Post not found' }, { status: 404 });
    }

    return json(updatedPost);
}

/**
 * 메모를 삭제합니다.
 */
export async function DELETE({ params }) {
    const { slug } = params;
    const result = await deletePost(slug);

    if (!result.success) {
        return json({ message: 'Post not found' }, { status: 404 });
    }

    return json({ message: 'Post deleted successfully' });
}