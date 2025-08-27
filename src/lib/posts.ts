import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const memosDir = path.resolve('memos');

// `memos` 디렉토리가 없으면 생성
if (!fs.existsSync(memosDir)) {
    fs.mkdirSync(memosDir, { recursive: true });
}

/**
 * 모든 메모의 목록을 가져옵니다.
 */
export function getPosts() {
    const files = fs.readdirSync(memosDir).filter(file => file.endsWith('.md'));
    const memos = files.map(file => {
        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(memosDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        return {
            slug,
            title: data.title || slug.replace(/-/g, ' '), // frontmatter의 title을 사용
        };
    }).sort((a, b) => a.title.localeCompare(b.title)); // 제목순으로 정렬

    return memos;
}

/**
 * 특정 slug의 메모를 가져와 HTML로 렌더링합니다.
 * @param {string} slug 
 */
export function getPost(slug) {
    const decodedSlug = decodeURIComponent(slug);
    const filePath = path.join(memosDir, `${decodedSlug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    const html = marked(content);

    return {
        slug: decodedSlug, // slug를 반환값에 추가
        title: data.title || decodedSlug.replace(/-/g, ' '),
        html,
        date: data.date || null,
        ip: data.ip || null,
    };
}

/**
 * 특정 slug 메모의 원본 마크다운 내용을 가져옵니다.
 * @param {string} slug 
 */
export function getRawPost(slug) {
    const decodedSlug = decodeURIComponent(slug);
    const filePath = path.join(memosDir, `${decodedSlug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
        title: data.title || decodedSlug.replace(/-/g, ' '),
        content,
    };
}

/**
 * 새 메모를 생성합니다.
 * @param {string} title 
 * @param {string} content 
 * @param {string} ip
 */
export function createPost(title, content, ip) {
    const slug = title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\uAC00-\uD7A3-]/g, '');
    const filePath = path.join(memosDir, `${slug}.md`);

    const fileContent = `---
title: "${title}"
date: "${new Date().toISOString()}"
ip: "${ip}"
---

${content}`;

    fs.writeFileSync(filePath, fileContent);

    return { slug, title };
}

/**
 * 특정 slug의 메모를 수정합니다.
 * @param {string} slug
 * @param {string} newTitle
 * @param {string} newContent
 */
export function updatePost(slug, newTitle, newContent) {
    const decodedSlug = decodeURIComponent(slug);
    const filePath = path.join(memosDir, `${decodedSlug}.md`);
    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: originalData } = matter(fileContent);

    const newData = {
        ...originalData,
        title: newTitle,
    };

    const newFileContent = matter.stringify(newContent, newData);
    fs.writeFileSync(filePath, newFileContent);

    return { slug: decodedSlug };
}

/**
 * 특정 slug의 메모를 삭제합니다.
 * @param {string} slug 
 */
export function deletePost(slug) {
    const decodedSlug = decodeURIComponent(slug);
    const filePath = path.join(memosDir, `${decodedSlug}.md`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { success: true };
    }
    return { success: false };
}
