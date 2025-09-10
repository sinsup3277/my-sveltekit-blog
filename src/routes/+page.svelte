
<script lang="ts">
    export let data;
</script>

<div id="wrapper">
    <p>이것은<br>메인 페이지입니다.</p>

    {#if data.isAdmin}
        <div class="admin-actions">
            <a href="/memo" class="btn-admin">메모 관리</a>
            <a href="/settings" class="btn-admin">설정</a>
        </div>
    {/if}
</div>

<style>
    #wrapper {
        text-align: center;
    }
    .admin-actions {
        margin-top: 2rem;
        display: flex;
        justify-content: center;
        gap: 1rem;
    }
    .btn-admin {
        display: inline-block;
        padding: 0.8rem 1.5rem;
        background-color: var(--primary-color);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        transition: background-color 0.2s ease;
    }
    .btn-admin:hover {
        background-color: var(--link-hover-color);
    }
</style>
