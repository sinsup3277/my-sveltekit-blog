import { put, head } from '@vercel/blob';
import * as cache from '$lib/cache';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

const BLOB_FILENAME = 'ip-aliases.json';
const CACHE_KEY = 'ip-aliases';

const blobOptions = {
    token: BLOB_READ_WRITE_TOKEN,
};

/**
 * Vercel Blob에서 별명 목록을 가져옵니다. (내부용, 캐시 적용)
 * @returns {Promise<Record<string, string>>}
 */
async function getAliasesFromBlob(): Promise<Record<string, string>> {
    return cache.get(CACHE_KEY, async () => {
        try {
            const blob = await head(BLOB_FILENAME, blobOptions);
            const response = await fetch(blob.downloadUrl);
            if (!response.ok) return {};
            return await response.json();
        } catch (error) {
            // 404는 파일이 아직 없다는 의미이므로, 정상적인 빈 객체를 반환
            if (error.constructor.name === 'BlobNotFoundError') {
                return {};
            }
            // 그 외의 에러는 throw
            console.error("Error fetching aliases from blob:", error);
            throw error;
        }
    });
}

/**
 * 변경된 별명 목록을 Vercel Blob에 저장하고 캐시를 무효화합니다.
 * @param {Record<string, string>} aliases
 */
async function saveAliasesToBlob(aliases: Record<string, string>): Promise<void> {
    await put(BLOB_FILENAME, JSON.stringify(aliases, null, 2), {
        access: 'public',
        allowOverwrite: true,
        ...blobOptions,
    });
    cache.invalidate(CACHE_KEY);
}

/**
 * 모든 IP 별명 목록을 비동기적으로 가져옵니다.
 */
export async function getAliases(): Promise<Record<string, string>> {
    return getAliasesFromBlob();
}

/**
 * IP 주소에 해당하는 표시 이름을 비동기적으로 가져옵니다.
 * @param {string} ip 
 */
export async function getDisplayName(ip: string): Promise<string> {
    if (!ip) return 'Unknown';
    const aliases = await getAliasesFromBlob();
    return aliases[ip] || ip;
}

/**
 * IP 주소에 대한 별명을 비동기적으로 설정합니다.
 * @param {string} ip 
 * @param {string} name 
 */
export async function setAlias(ip: string, name: string): Promise<void> {
    const aliases = await getAliasesFromBlob();
    aliases[ip] = name;
    await saveAliasesToBlob(aliases);
}

/**
 * IP 주소에 대한 별명을 비동기적으로 삭제합니다.
 * @param {string} ip 
 */
export async function deleteAlias(ip: string): Promise<void> {
    const aliases = await getAliasesFromBlob();
    delete aliases[ip];
    await saveAliasesToBlob(aliases);
}
