<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let isOpen = false;

    let aliases: Record<string, string> = {};
    let ipInput = '';
    let nameInput = '';
    let isEditing = false;

    const dispatch = createEventDispatcher();

    async function fetchAliases() {
        const res = await fetch('/api/ip-aliases');
        if (res.ok) {
            aliases = await res.json();
        }
    }

    function handleEditClick(ip: string, name: string) {
        ipInput = ip;
        nameInput = name;
        isEditing = true;
    }

    function cancelEdit() {
        ipInput = '';
        nameInput = '';
        isEditing = false;
    }

    async function handleDeleteClick(ip: string) {
        if (!confirm(`'${aliases[ip]}' (${ip}) 별명을 삭제하시겠습니까?`)) {
            return;
        }
        const res = await fetch('/api/ip-aliases', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip })
        });
        if (res.ok) await fetchAliases();
    }

    async function handleSubmit() {
        if (!ipInput || !nameInput) {
            alert('IP 주소와 이름을 모두 입력해주세요.');
            return;
        }
        const res = await fetch('/api/ip-aliases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip: ipInput, name: nameInput })
        });
        if (res.ok) {
            cancelEdit();
            await fetchAliases();
        }
    }

    function closeModal() {
        dispatch('close');
    }

    // isOpen 프라퍼티가 true로 바뀔 때마다 데이터를 가져옴
    $: if (isOpen) {
        fetchAliases();
    }
</script>

{#if isOpen}
    <div class="modal-overlay" on:click={closeModal} role="presentation">
        <div class="modal-content" on:click|stopPropagation>
            <button class="close-button" on:click={closeModal}>&times;</button>
            <h3>IP 별명 관리</h3>
            <div class="alias-list">
                {#each Object.entries(aliases) as [ip, name] (ip)}
                    <div class="alias-item">
                        <div class="alias-info">
                            <strong>{name}</strong>: <span>{ip}</span>
                        </div>
                        <div class="alias-actions">
                            <button on:click={() => handleEditClick(ip, name)}>수정</button>
                            <button on:click={() => handleDeleteClick(ip)} class="btn-danger">삭제</button>
                        </div>
                    </div>
                {:else}
                    <div class="empty-message">
                        <p>저장된 별명이 없습니다.</p>
                    </div>
                {/each}
            </div>
            <form on:submit|preventDefault={handleSubmit}>
                <input type="text" bind:value={ipInput} placeholder="IP 주소" readonly={isEditing} />
                <input type="text" bind:value={nameInput} placeholder="이름" />
                <div class="form-actions">
                    {#if isEditing}
                        <button type="button" on:click={cancelEdit} class="btn-secondary">취소</button>
                    {/if}
                    <button type="submit">{isEditing ? '수정 완료' : '새로 저장'}</button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal-content {
        position: relative;
        background: white;
        padding: 2rem;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        font-weight: bold;
        border: none;
        background: transparent;
        cursor: pointer;
    }
    h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
    }
    .alias-list {
        margin-bottom: 1rem;
        max-height: 250px;
        overflow-y: auto;
        font-size: 0.875rem;
    }
    .alias-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0.25rem;
        border-bottom: 1px solid #eee;
    }
    .alias-info span {
        color: #666;
    }
    .alias-actions {
        display: flex;
        gap: 0.25rem;
    }
    .alias-actions button {
        padding: 0.2rem 0.4rem;
        font-size: 0.75rem;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    input[readonly] {
        background-color: #f0f0f0;
        cursor: not-allowed;
    }
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .form-actions button {
        background-color: #333;
        color: white;
    }
    .form-actions button:hover {
        background-color: #555;
    }
    .btn-danger {
        background-color: #f44336;
    }
    .btn-secondary {
        background-color: #ccc;
        color: #333;
    }
</style>
