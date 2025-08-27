import { error } from '@sveltejs/kit';
import { getPost } from '$lib/posts';
import { getDisplayName } from '$lib/ipManager';

export async function load({ params }) {
    const post = getPost(params.slug);

    if (!post) {
        throw error(404, 'Not found');
    }

    // IP 주소에 대한 표시 이름(별명 또는 IP) 가져오기
    const displayName = post.ip ? getDisplayName(post.ip) : 'Unknown';

    return {
        post,
        displayName,
    };
}