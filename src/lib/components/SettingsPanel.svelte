<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let isOpen = false;

    const dispatch = createEventDispatcher();

    function openIpAliasModal() {
        dispatch('openIpAliasModal');
    }
</script>

{#if isOpen}
<div class="settings-panel">
    <h4>관리자 설정</h4>
    <ul>
        <li>
            <button on:click={openIpAliasModal}>IP 별명 관리</button>
        </li>
        <!-- 다른 설정 항목이 추가될 수 있습니다 -->
    </ul>
</div>
{/if}

<style>
    .settings-panel {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        background-color: white;
        border: 1px solid #eee;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        width: 200px;
        z-index: 1100;
        padding: 0.5rem;
    }
    h4 {
        font-size: 0.875rem;
        color: #666;
        padding: 0.5rem 0.75rem;
        margin: 0;
        border-bottom: 1px solid #eee;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0 0;
    }
    button {
        width: 100%;
        padding: 0.75rem;
        border: none;
        background: transparent;
        text-align: left;
        cursor: pointer;
        border-radius: 4px;
        color: #333; /* 글자색 추가 */
    }
    button:hover {
        background-color: #f5f5f5;
    }
</style>
