<script lang="ts">
    import { goto } from '$app/navigation';

    export let data;

    let title = data.post.title;
    let content = data.post.content;

    async function handleSubmit() {
        const res = await fetch(`/api/memos/${data.slug}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (res.ok) {
            alert('수정되었습니다.');
            goto(`/memo/${data.slug}`);
        } else {
            alert('수정에 실패했습니다.');
        }
    }
</script>

<div class="edit-container">
    <h1>메모 수정</h1>
    <form on:submit|preventDefault={handleSubmit} class="memo-form">
        <input type="text" bind:value={title} placeholder="제목" required />
        <textarea bind:value={content} placeholder="내용" rows="15" required />
        <div class="form-actions">
            <a href="/memo/{data.slug}" class="btn-secondary">취소</a>
            <button type="submit" class="btn-primary">저장</button>
        </div>
    </form>
</div>

<style>
    .edit-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }
    .memo-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }
    input,
    textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
    }
    .btn-primary, .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        text-decoration: none;
        display: inline-block;
        text-align: center;
    }
    .btn-primary {
        background-color: #333;
        color: white;
    }
    .btn-secondary {
        background-color: #eee;
        color: #333;
    }
</style>
