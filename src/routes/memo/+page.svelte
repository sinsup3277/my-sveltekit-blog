
<script lang="ts">
	import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    export let data; // Received from +layout.server.ts

    // --- State ---
	let memos: { slug: string; title: string }[] = [];
    let isModalOpen = false;
    let activeMemo: { slug: string | null; title: string; content: string } | null = null;
    let hasChanges = false;
    let isSaving = false;
    let saveStatus = '';
    let notification = { message: '', type: 'info', visible: false };
    let notificationTimeout: ReturnType<typeof setTimeout>;


    // --- Data Fetching ---
	onMount(async () => {
		const res = await fetch('/api/memos');
		if (res.ok) {
			memos = await res.json();
		}
	});

    // --- Helper Functions ---
    function showNotification(message: string, type: 'success' | 'error' = 'success') {
        clearTimeout(notificationTimeout);
        notification = { message, type, visible: true };
        notificationTimeout = setTimeout(() => {
            notification.visible = false;
        }, 2000);
    }

    // --- Event Handlers ---
    async function openMemoModal(slug: string) {
        const res = await fetch(`/api/memos/${slug}`);
        if (res.ok) {
            const post = await res.json();
            activeMemo = { slug, ...post };
            isModalOpen = true;
            hasChanges = false;
            saveStatus = '';
        } else {
            showNotification('메모를 불러오는 데 실패했습니다.', 'error');
        }
    }

    function openNewModal() {
        if (!data.isAdmin) return;
        activeMemo = { slug: null, title: '', content: '' };
        isModalOpen = true;
        hasChanges = false;
        saveStatus = '';
    }

    function closeModal() {
        if (data.isAdmin && hasChanges && !confirm('변경사항이 있습니다. 저장하지 않고 닫으시겠습니까?')) {
            return;
        }
        isModalOpen = false;
        activeMemo = null;
    }

    function handleContentChange() {
        if (!data.isAdmin) return;
        hasChanges = true;
        saveStatus = '';
    }

    async function handleSave() {
        if (!activeMemo || !data.isAdmin) return;

        isSaving = true;
        saveStatus = '';
        const isNew = activeMemo.slug === null;

        try {
            const url = isNew ? '/api/memos' : `/api/memos/${activeMemo.slug}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: activeMemo.title, content: activeMemo.content })
            });

            if (res.ok) {
                hasChanges = false;
                saveStatus = '저장 완료!';
                const savedPost = await res.json();

                if (isNew) {
                    memos = [...memos, savedPost].sort((a, b) => a.title.localeCompare(b.title));
                    activeMemo.slug = savedPost.slug;
                } else {
                    memos = memos.map(m => m.slug === activeMemo?.slug ? { ...m, title: activeMemo.title } : m);
                }
            } else {
                const errorData = await res.json();
                saveStatus = errorData.message || '저장 실패';
            }
        } catch (e) {
            saveStatus = '오류 발생';
        } finally {
            isSaving = false;
            setTimeout(() => saveStatus = '', 2000);
        }
    }

    async function handleDelete(slug: string) {
        if (!data.isAdmin || !confirm('정말로 이 메모를 삭제하시겠습니까?')) return;

        const res = await fetch(`/api/memos/${slug}`, { method: 'DELETE' });
        if (res.ok) {
            memos = memos.filter(m => m.slug !== slug);
            showNotification('메모가 삭제되었습니다.', 'success');
        } else {
            showNotification('삭제에 실패했습니다.', 'error');
        }
    }

</script>

<div class="memo-container">
	<h1>&lt; 메모장 &gt;</h1>
	<p>목록에서 메모를 선택하여 내용을 확인하거나, 관리자로 로그인하여 수정하세요.</p>

    {#if data.isAdmin}
        <div class="toolbar">
            <button class="btn-new-memo" on:click={openNewModal}>+ 새 메모 작성</button>
        </div>
    {/if}

	<hr />

	<h2>작성된 메모</h2>
	<ul class="memo-list">
		{#each memos as memo}
			<li>
                <div class="memo-card-wrapper">
                    <button class="memo-card" on:click={() => openMemoModal(memo.slug)} title={data.isAdmin ? '메모 수정' : '메모 보기'}>
                        <span>{memo.title}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                    {#if data.isAdmin}
                        <button class="btn-delete" on:click={() => handleDelete(memo.slug)} title="메모 삭제">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    {/if}
                </div>
			</li>
        {:else}
            <p class="no-memos">작성된 메모가 없습니다.{#if data.isAdmin} 위 버튼을 눌러 시작하세요.{/if}</p>
		{/each}
	</ul>
</div>

<!-- View/Edit Modal -->
{#if isModalOpen && activeMemo}
    <div class="modal-overlay" on:click={closeModal}>
        <div class="modal-editor" on:click|stopPropagation>
            <button class="close-button" on:click={closeModal} aria-label="닫기">&times;</button>
            <input 
                type="text" 
                bind:value={activeMemo.title} 
                on:input={handleContentChange} 
                class="editor-title" 
                placeholder="제목을 입력하세요" 
                readonly={!data.isAdmin} 
            />
            <textarea 
                bind:value={activeMemo.content} 
                on:input={handleContentChange} 
                class="editor-content" 
                placeholder="내용을 입력하세요" 
                readonly={!data.isAdmin}
            ></textarea>
            {#if data.isAdmin}
                <div class="editor-actions">
                    <span class="save-status">{saveStatus}</span>
                    <button class="btn-save" on:click={handleSave} disabled={!hasChanges || isSaving}>
                        {isSaving ? '저장 중...' : '저장'}
                    </button>
                </div>
            {/if}
        </div>
    </div>
{/if}

<!-- Notification Popup -->
{#if notification.visible}
    <div class="notification {notification.type}" transition:fade={{ duration: 300 }}>
        {notification.message}
    </div>
{/if}

<style>
    /* --- General Page Styles --- */
	.memo-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}
    h1, p { text-align: center; }
	h2 { margin-top: 2rem; text-align: center; }
    .toolbar {
        display: flex;
        justify-content: center;
        margin: 1.5rem 0;
    }
    .btn-new-memo {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .btn-new-memo:hover {
        background-color: var(--link-hover-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
	.memo-list {
		list-style: none;
		padding: 0;
		margin-top: 1rem;
		display: grid;
		gap: 0.75rem;
	}
    .no-memos {
        color: #888;
        text-align: center;
        margin-top: 2rem;
    }
    .memo-card-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
	.memo-card {
        flex-grow: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background-color: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		color: var(--text-color);
		text-decoration: none;
		transition: all 0.2s ease;
        cursor: pointer;
        text-align: left;
	}
	.memo-card:hover {
		border-color: var(--primary-color);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}
	.memo-card span { font-weight: 500; }
	.memo-card svg { color: var(--text-color-light); }
    .btn-delete {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.6rem;
        border-radius: 50%;
        border: none;
        background-color: transparent;
        color: #aaa;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .btn-delete:hover {
        background-color: #f8d7da;
        color: #721c24;
    }

    /* --- Modal Styles --- */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        padding: 2rem;
    }
    .modal-editor {
        width: 100%;
        max-width: 1000px;
        height: 90vh;
        background-color: var(--card-bg);
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        padding: 1rem 2rem 1.5rem 2rem; /* 상, 좌우, 하 */
        position: relative;
    }
    .close-button {
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        font-size: 2rem;
        font-weight: 300;
        line-height: 1;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--text-color);
        opacity: 0.5;
        padding: 0.5rem;
    }
    .close-button:hover {
        opacity: 1;
        background-color: transparent;
    }
    .editor-title {
        font-size: 1.75rem;
        font-weight: 700;
        padding: 0.5rem;
        border: none;
        border-bottom: 2px solid var(--border-color);
        margin: 1.5rem 0 1rem 0; /* 좌우 마진 제거 */
        background: transparent;
        color: var(--text-color);
    }
    .editor-title:focus {
        outline: none;
        border-bottom-color: var(--primary-color);
    }
    .editor-content {
        flex-grow: 1;
        font-family: inherit;
        font-size: 1rem;
        line-height: 1.7;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        background: var(--bg-color);
        color: var(--text-color);
        resize: none;
        margin: 0 0 1rem 0; /* 좌우 마진 제거, 하단 마진 추가 */
    }
    .editor-content:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    .editor-title[readonly],
    .editor-content[readonly] {
        cursor: text;
        background-color: var(--bg-color);
    }
    .editor-title[readonly]:focus,
    .editor-content[readonly]:focus {
        border-color: var(--border-color);
    }

    .editor-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin: 0; /* 마진 제거 */
        gap: 1rem;
    }
    .save-status {
        color: var(--primary-color);
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .save-status:not(:empty) {
        opacity: 1;
    }
    .btn-save {
        padding: 0.6rem 1.2rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.2s ease;
    }
    .btn-save:hover:not(:disabled) {
        background-color: var(--link-hover-color);
    }
    .btn-save:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    /* --- Notification Styles --- */
    .notification {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
    }
    .notification.success {
        background-color: var(--primary-color);
    }
    .notification.error {
        background-color: #dc3545; /* Red */
    }
</style>
