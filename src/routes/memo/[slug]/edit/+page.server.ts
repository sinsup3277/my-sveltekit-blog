import { error } from '@sveltejs/kit';
import { getRawPost } from '$lib/posts';

export async function load({ params }) {
    const post = await getRawPost(params.slug);

    if (!post) {
        throw error(404, 'Not found');
    }

    return {
        slug: params.slug,
        post,
    };
}
