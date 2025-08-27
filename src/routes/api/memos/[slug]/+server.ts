import { json } from '@sveltejs/kit';
import { updatePost, deletePost } from '$lib/posts';

/**
 * 메모를 수정합니다.
 */
export async function PUT({ params, request }) {
    const { slug } = params;
    const { title, content } = await request.json();

    if (!title || !content) {
        return json({ message: 'Title and content are required' }, { status: 400 });
    }

    const updatedPost = updatePost(slug, title, content);

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
    const result = deletePost(slug);

    if (!result.success) {
        return json({ message: 'Post not found' }, { status: 404 });
    }

    return json({ message: 'Post deleted successfully' });
}
