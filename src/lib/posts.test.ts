import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPost, getPosts } from './posts';
import * as vercelBlob from '@vercel/blob';
import * as cache from '$lib/cache';

// --- Mocking --- //

// Create a custom error class that mimics the real BlobNotFoundError
class MockBlobNotFoundError extends Error {
    constructor(message = 'Vercel Blob: The requested blob does not exist') {
        super(message);
        this.name = 'BlobNotFoundError';
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
}

vi.mock('@vercel/blob', () => ({
    head: vi.fn(),
    put: vi.fn(),
    del: vi.fn(),
    list: vi.fn(),
}));

vi.mock('$lib/cache', () => ({
    get: vi.fn((key, fetcher) => fetcher()),
    set: vi.fn(),
    invalidate: vi.fn(),
}));

const mockedHead = vi.mocked(vercelBlob.head);
const mockedPut = vi.mocked(vercelBlob.put);

// --- Tests --- //

describe('createPost', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a post successfully when the blob does not exist', async () => {
        // ARRANGE: Simulate the "not found" scenario by having `head` throw BlobNotFoundError
        mockedHead.mockRejectedValue(new MockBlobNotFoundError());

        // ACT & ASSERT: We expect createPost to complete without throwing an error
        await expect(createPost('New Unique Post', 'content', 'ip')).resolves.not.toThrow();

        // ASSERT: Check if `put` was called, meaning the function proceeded correctly
        expect(mockedPut).toHaveBeenCalledOnce();
    });
});
