import { json } from '@sveltejs/kit';
import { getAliases, setAlias, deleteAlias } from '$lib/ipManager';

/**
 * 모든 IP 별명 목록을 반환합니다.
 */
export async function GET() {
    const aliases = getAliases();
    return json(aliases);
}

/**
 * 새 IP 별명을 저장하거나 기존 별명을 수정합니다.
 */
export async function POST({ request }) {
    const { ip, name } = await request.json();

    if (!ip || !name) {
        return json({ message: 'IP and name are required' }, { status: 400 });
    }

    setAlias(ip, name);

    return json({ message: 'Alias saved successfully' }, { status: 201 });
}

/**
 * IP 별명을 삭제합니다.
 */
export async function DELETE({ request }) {
    const { ip } = await request.json();

    if (!ip) {
        return json({ message: 'IP is required' }, { status: 400 });
    }

    deleteAlias(ip);

    return json({ message: 'Alias deleted successfully' });
}