<script lang="ts">
	import { createEventDispatcher } from "svelte";
    import theme from '$lib/stores/theme';

	export let isOpen = false;

	const dispatch = createEventDispatcher();

    // Group the themes for better UI organization
    const themeGroups = [
        {
            title: '주요 테마',
            themes: [
                { name: 'light', label: '라이트', color: '#f8f9fa' },
                { name: 'dark', label: '다크', color: '#1a1a1a' },
                { name: 'sepia', label: '세피아', color: '#f4e8d5' },
                { name: 'slate', label: '슬레이트', color: '#2d3748' },
            ]
        },
        {
            title: '파스텔 배경',
            themes: [
                { name: 'pastel-blue', label: '블루', color: '#f0f8ff' },
                { name: 'pastel-beige', label: '베이지', color: '#faebd7' },
                { name: 'pastel-green', label: '그린', color: '#f0fff0' },
                { name: 'pastel-lavender', label: '라벤더', color: '#e6e6fa' },
            ]
        }
    ];

	function openIpAliasModal() {
		dispatch('openIpAliasModal');
	}

    function selectTheme(themeName: string) {
        theme.set(themeName);
    }
</script>

{#if isOpen}
<div class="settings-panel">
    <h4>관리자 설정</h4>
    <ul>
        <li>
            <button on:click={openIpAliasModal}>IP 별명 관리</button>
        </li>
    </ul>
    
    {#each themeGroups as group}
        <div class="divider"></div>
        <div class="theme-section">
            <h5>{group.title}</h5>
            <div class="theme-options">
                {#each group.themes as themeItem}
                    <button
                        class="theme-swatch"
                        class:selected={$theme === themeItem.name}
                        style="background-color: {themeItem.color};"
                        on:click={() => selectTheme(themeItem.name)}
                        aria-label="{themeItem.label} 테마"
                        title="{themeItem.label}"
                    ></button>
                {/each}
            </div>
        </div>
    {/each}
</div>
{/if}

<style>
    .settings-panel {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        width: 220px;
        z-index: 1100;
        padding: 0.5rem;
        color: var(--text-color);
    }
    h4, h5 {
        font-size: 0.875rem;
        color: var(--text-color);
        padding: 0.5rem 0.75rem;
        margin: 0;
    }
    h4 {
        border-bottom: 1px solid var(--border-color);
    }
    h5 {
        font-weight: 500;
        opacity: 0.8;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0;
    }
    button {
        width: 100%;
        padding: 0.75rem;
        border: none;
        background: transparent;
        text-align: left;
        cursor: pointer;
        border-radius: 4px;
        color: var(--text-color);
    }
    button:hover {
        background-color: rgba(128, 128, 128, 0.1);
    }

    .divider {
        height: 1px;
        background-color: var(--border-color);
        margin: 0.5rem 0.75rem;
    }

    .theme-section {
        padding: 0.25rem 0;
    }

    .theme-options {
        display: flex;
        justify-content: space-around;
        padding: 0.5rem 0.75rem;
    }

    .theme-swatch {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s ease;
        padding: 0; /* Reset padding */
        outline-offset: 2px;
    }

    .theme-swatch:hover {
        transform: scale(1.1);
    }

    .theme-swatch.selected {
        border-color: var(--primary-color);
        outline: 2px solid var(--primary-color);
    }
</style>
