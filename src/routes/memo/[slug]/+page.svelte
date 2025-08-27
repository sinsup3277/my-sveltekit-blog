<script lang="ts">
  import { goto } from '$app/navigation';

  export let data;

  // 날짜를 보기 좋게 포맷하는 함수
  function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleString('ko-KR');
  }

  async function handleDelete() {
    if (!confirm('정말로 이 메모를 삭제하시겠습니까?')) {
        return;
    }

    const res = await fetch(`/api/memos/${data.post.slug}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        alert('메모가 삭제되었습니다.');
        goto('/memo');
    } else {
        alert('삭제에 실패했습니다.');
    }
  }
</script>

<div id="wrapper">
    <main>
        <h1>{data.post.title}</h1>

        <div class="metadata">
            <span>작성일: {formatDate(data.post.date)}</span>
            <span>작성자: {data.displayName}</span>
        </div>

        <div class="actions">
            <a href="/memo/{data.post.slug}/edit" class="btn-secondary">수정</a>
            <button on:click={handleDelete} class="btn-danger">삭제</button>
        </div>

        <div class="content">
            {@html data.post.html}
        </div>
    </main>
</div>

<style>
    #wrapper {
        padding: 2rem;
    }
    main {
        max-width: 800px;
        margin: 0 auto;
    }
    .metadata {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #666;
        display: flex;
        gap: 1rem;
    }
    .actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
    }
    .btn-secondary, .btn-danger {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        text-decoration: none;
        cursor: pointer;
        font-size: 0.875rem;
    }
    .btn-secondary {
        background-color: #eee;
        color: #333;
    }
    .btn-danger {
        background-color: #f44336;
        color: white;
    }
    .content {
        margin-top: 2rem;
        line-height: 1.6;
    }
</style>