
import { put, del, list, head } from '@vercel/blob';
import matter from 'gray-matter';
import { marked } from 'marked';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import * as cache from '$lib/cache';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// Create a DOMPurify instance for the server environment
const window = new JSDOM('').window;
const purify = DOMPurify(window);

if (!BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN environment variable");
}

const blobOptions = {
    token: BLOB_READ_WRITE_TOKEN,
};

const POSTS_CACHE_KEY = 'posts';
const getPostContentCacheKey = (slug: string) => `post-content:${slug}`;

function getPostContent(slug: string) {
    const decodedSlug = decodeURIComponent(slug);
    const pathname = `${decodedSlug}.md`;
    return cache.get(getPostContentCacheKey(decodedSlug), async () => {
        console.log(`Fetching from Blob: ${pathname}`);
        const blob = await head(pathname, blobOptions);
        const response = await fetch(blob.downloadUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch blob content for ${slug}`);
        }
        return response.text();
    });
}

export function getPosts() {
    return cache.get(POSTS_CACHE_KEY, async () => {
        try {
            console.log('Fetching posts list from Blob...');
            const { blobs } = await list({ ...blobOptions, mode: 'folded' });
            const memos = blobs
                .filter(blob => blob.pathname.endsWith('.md'))
                .map(blob => {
                    const slug = blob.pathname.replace(/\.md$/, '');
                    return {
                        slug,
                        title: blob.customMetadata?.title || slug.replace(/-/g, ' '),
                    };
                })
                .sort((a, b) => a.title.localeCompare(b.title));

            console.log(`Pre-warming cache for ${memos.length} posts.`)
            for (const memo of memos) {
                getPostContent(memo.slug).catch(err => {
                    console.error(`Failed to pre-warm cache for ${memo.slug}:`, err);
                });
            }

            return memos;
        } catch (error) {
            console.error("Error listing blobs:", error);
            return [];
        }
    });
}

export async function getPost(slug) {
    try {
        const fileContent = await getPostContent(slug);
        const { data, content } = matter(fileContent);
        
        // Convert Markdown to HTML, then sanitize it
        const rawHtml = marked(content);
        const html = purify.sanitize(rawHtml);

        const decodedSlug = decodeURIComponent(slug);

        return {
            slug: decodedSlug,
            title: data.title || decodedSlug.replace(/-/g, ' '),
            html,
            date: data.date || null,
            ip: data.ip || null,
        };
    } catch (error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
            return null;
        }
        console.error(`Error getting post "${slug}":`, error);
        throw error;
    }
}

export async function getRawPost(slug) {
    try {
        const fileContent = await getPostContent(slug);
        const { data, content } = matter(fileContent);
        const decodedSlug = decodeURIComponent(slug);

        return {
            title: data.title || decodedSlug.replace(/-/g, ' '),
            content,
        };
    } catch (error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
            return null;
        }
        console.error(`Error getting raw post "${slug}":`, error);
        throw error;
    }
}

export async function createPost(title, content, ip) {
    const slug = title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\uAC00-\uD7A3-]/g, '');
    const pathname = `${slug}.md`;

    try {
        await head(pathname, blobOptions);
        // If head succeeds, the blob exists.
        throw new Error('DUPLICATE_TITLE');
    } catch (error) {
        // The error thrown for a 404 has a constructor.name of 'BlobNotFoundError'.
        if (error.constructor.name !== 'BlobNotFoundError') {
            throw error;
        }
    }

    const fileContent = `---
title: "${title}"
date: "${new Date().toISOString()}"
ip: "${ip}"
---

${content}`;

    await put(pathname, fileContent, {
        access: 'public',
        ...blobOptions,
        customMetadata: { title },
    });

    cache.set(getPostContentCacheKey(slug), Promise.resolve(fileContent));

    const postsPromise = cache.get(POSTS_CACHE_KEY, async () => null);
    postsPromise.then(cachedPosts => {
        if (cachedPosts) {
            const newPostEntry = { slug, title };
            const newPosts = [...cachedPosts, newPostEntry].sort((a, b) => a.title.localeCompare(b.title));
            cache.set(POSTS_CACHE_KEY, Promise.resolve(newPosts));
            console.log('Optimistically updated posts list cache.');
        } else {
            cache.invalidate(POSTS_CACHE_KEY);
        }
    });

    return { slug, title };
}

export async function updatePost(slug, newTitle, newContent) {
    const decodedSlug = decodeURIComponent(slug);
    const pathname = `${decodedSlug}.md`;

    try {
        const originalFileContent = await getPostContent(slug);
        const { data: originalData } = matter(originalFileContent);
        
        const newData = { ...originalData, title: newTitle };
        const newFileContent = matter.stringify(newContent, newData);

        await put(pathname, newFileContent, {
            access: 'public',
            allowOverwrite: true,
            ...blobOptions,
            customMetadata: { title: newTitle },
        });

        cache.invalidate(POSTS_CACHE_KEY);
        cache.set(getPostContentCacheKey(decodedSlug), Promise.resolve(newFileContent));

        return { slug: decodedSlug };

    } catch (error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
            return null; // Memo not found
        }
        console.error(`Error updating post "${slug}":`, error);
        throw error;
    }
}

export async function deletePost(slug) {
    const decodedSlug = decodeURIComponent(slug);
    const pathname = `${decodedSlug}.md`;
    
    try {
        const { blobs } = await list({ prefix: pathname, ...blobOptions });
        const blobToDelete = blobs.find(b => b.pathname === pathname);

        if (blobToDelete) {
            await del(blobToDelete.url, { ...blobOptions });
            cache.invalidate(POSTS_CACHE_KEY);
            cache.invalidate(getPostContentCacheKey(decodedSlug));
            return { success: true };
        }
        return { success: true, message: 'Memo not found, no action needed.' };

    } catch (error) {
        console.error(`Error deleting post "${slug}":`, error);
        return { success: false, error: error.message };
    }
}
