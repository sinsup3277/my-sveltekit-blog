import { json } from '@sveltejs/kit';
import { getAliases, setAlias, deleteAlias } from '$lib/ipManager';
import { z } from 'zod';

// Schema for creating/updating an alias
const aliasSchema = z.object({
    ip: z.string().ip({ message: "유효하지 않은 IP 주소 형식입니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }).max(50, { message: "이름은 50자를 넘을 수 없습니다." }),
});

// Schema for deleting an alias
const deleteAliasSchema = z.object({
    ip: z.string().ip({ message: "유효하지 않은 IP 주소 형식입니다." }),
});

/**
 * 모든 IP 별명 목록을 반환합니다.
 */
export async function GET({ locals }) {
    if (!locals.isAdmin) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }
    const aliases = await getAliases();
    return json(aliases);
}

/**
 * 새 IP 별명을 저장하거나 기존 별명을 수정합니다.
 */
export async function POST({ request, locals }) {
    if (!locals.isAdmin) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const result = aliasSchema.safeParse(body);

    if (!result.success) {
        return json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    await setAlias(result.data.ip, result.data.name);

    return json({ message: 'Alias saved successfully' }, { status: 201 });
}

/**
 * IP 별명을 삭제합니다.
 */
export async function DELETE({ request, locals }) {
    if (!locals.isAdmin) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const result = deleteAliasSchema.safeParse(body);

    if (!result.success) {
        return json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    await deleteAlias(result.data.ip);

    return json({ message: 'Alias deleted successfully' });
}