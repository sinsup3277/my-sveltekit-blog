<script lang="ts">
	import '../app.css';
	import IpAliasManager from '$lib/components/IpAliasManager.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
    import theme from '$lib/stores/theme';
    import { onMount } from 'svelte';

    export let data; // From +layout.server.ts

    // Apply the theme on component mount and whenever it changes
    onMount(() => {
        const unsubscribe = theme.subscribe(value => {
            document.documentElement.setAttribute('data-theme', value);
        });
        return unsubscribe; // Clean up the subscription
    });

	let isMenuOpen = false;
	let showSettingsPanel = false;
	let showIpAliasModal = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	function closeMenu() {
		isMenuOpen = false;
	}

	function handleOpenIpAliasModal() {
		showIpAliasModal = true;
		showSettingsPanel = false; // 패널은 닫음
	}

    async function handleLogout() {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
            window.location.href = '/'; // Reload to clear state
        } else {
            alert('로그아웃에 실패했습니다.');
        }
    }
</script>

<!-- Auth Status UI -->
<div class="auth-status">
    {#if data.isAdmin}
        <span class="status-dot admin"></span>
        <span>관리자 모드</span>
        <button on:click={handleLogout} class="logout-button">로그아웃</button>
    {:else}
        <span class="status-dot guest"></span>
        <span>게스트</span>
    {/if}
</div>

<!-- IP 별명 관리 모달 -->
<IpAliasManager isOpen={showIpAliasModal} on:close={() => showIpAliasModal = false} />

<header>
	<nav class="main-nav">
		<a href="/" class="logo" on:click={closeMenu}>
			<img src="/logo.png" alt="Logo" width="35" height="35" />
			<span>shinsu의 블로그</span>
		</a>

		<div class="nav-right-section">
			<div class="nav-links-desktop">
				<a href="/">메인</a>
				<a href="/memo">메모장</a>
				<a href="/study">연구 중</a>
				<a href="/completed">연구 완료</a>
			</div>

			<div class="settings-container">
				<button class="settings-button" on:click={() => showSettingsPanel = !showSettingsPanel}>
					<!-- 톱니바퀴 SVG 아이콘 -->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.58-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.49.49 0 0 0-.48-.44H9.24a.49.49 0 0 0-.48.44l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.58.22L2.09 9.82a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.07.64-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32a.49.49 0 0 0 .58.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54a.49.49 0 0 0 .48.44h3.84a.49.49 0 0 0 .48-.44l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96a.49.49 0 0 0 .58-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58z"/><circle cx="12" cy="12" r="3"/></svg>
				</button>
				<SettingsPanel isOpen={showSettingsPanel} on:openIpAliasModal={handleOpenIpAliasModal} />
			</div>
		</div>

		<button class="hamburger" on:click={toggleMenu} class:is-active={isMenuOpen}>
			<span />
			<span />
			<span />
		</button>
	</nav>
	{#if isMenuOpen}
		<div class="nav-links-mobile" on:click={closeMenu}>
			<a href="/">메인</a>
			<a href="/memo">메모장</a>
			<a href="/study">연구 중</a>
			<a href="/completed">연구 완료</a>
		</div>
	{/if}
</header>

<main>
	<div class="main-container">
		<slot />
	</div>
</main>

<footer>
	<p>&copy; 2025 shinsu의 블로그</p>
</footer>

<style>
    .auth-status {
        position: fixed;
        top: 10px;
        right: 2rem;
        z-index: 1001; /* header보다 위에 오도록 */
        background-color: var(--card-bg);
        color: var(--text-color);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        font-weight: 500;
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    .status-dot.admin {
        background-color: #28a745; /* Green */
    }
    .status-dot.guest {
        background-color: #6c757d; /* Gray */
    }
    .logout-button {
        background: transparent;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9rem;
        padding: 0;
    }
    .logout-button:hover {
        text-decoration: underline;
    }

	:global(body) {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		background-color: var(--card-bg);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		padding: 0 2rem;
		border-bottom: 1px solid var(--border-color);
		position: relative;
		z-index: 100;
	}

	.main-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		height: 60px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--text-color);
	}
	.logo:hover {
		text-decoration: none;
	}

	.nav-right-section {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav-links-desktop {
		display: flex;
		gap: 1.5rem;
	}

	.nav-links-desktop a {
		color: var(--text-color);
		font-weight: 500;
		padding: 0.5rem 0;
		border-bottom: 2px solid transparent;
		transition: border-color 0.2s ease;
	}

	.nav-links-desktop a:hover {
		color: var(--primary-color);
		text-decoration: none;
		border-bottom-color: var(--primary-color);
	}

	.settings-container {
		position: relative;
	}

	.settings-button {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-color);
        width: 40px; /* 너비 고정 */
        height: 40px; /* 높이 고정 */
        border-radius: 50%; /* 원형 버튼 */
        transition: background-color 0.2s ease;
	}

    .settings-button svg {
        width: 24px; /* 아이콘 크기 */
        height: 24px;
    }

	.settings-button:hover {
		color: var(--primary-color);
        background-color: rgba(0,0,0,0.05); /* 호버 효과 */
	}

	main {
		flex: 1;
		width: 100%;
		padding: 2rem;
	}

	footer {
		text-align: center;
		padding: 1.5rem;
		color: #6c757d;
		font-size: 0.9rem;
		margin-top: auto;
	}

	.hamburger {
		display: none;
	}
	.nav-links-mobile {
		display: none;
	}

	@media (max-width: 768px) {
        .auth-status {
            top: 5px;
            right: 5rem; /* Adjust position for mobile */
        }
		.nav-links-desktop {
			display: none;
		}
		.nav-right-section {
			gap: 0.5rem;
		}
		.hamburger {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			width: 2rem;
			height: 2rem;
			background: transparent;
			border: none;
			cursor: pointer;
			padding: 0;
		}
		.hamburger:focus {
			outline: none;
		}
		.hamburger span {
			width: 2rem;
			height: 0.25rem;
			background: var(--text-color);
			border-radius: 10px;
			transition: all 0.3s linear;
			position: relative;
			transform-origin: 1px;
		}
		.hamburger.is-active span:nth-child(1) {
			transform: rotate(45deg);
		}
		.hamburger.is-active span:nth-child(2) {
			opacity: 0;
			transform: translateX(20px);
		}
		.hamburger.is-active span:nth-child(3) {
			transform: rotate(-45deg);
		}

		.nav-links-mobile {
			display: flex;
			flex-direction: column;
			align-items: center;
			background: var(--card-bg);
			position: absolute;
			top: 60px;
			left: 0;
			width: 100%;
			padding: 1rem 0;
			border-top: 1px solid var(--border-color);
		}
		.nav-links-mobile a {
			color: var(--text-color);
			font-weight: 500;
			padding: 1rem 0;
			width: 100%;
			text-align: center;
			transition: background-color 0.2s ease;
		}
		.nav-links-mobile a:hover {
			background-color: var(--bg-color);
			color: var(--primary-color);
			text-decoration: none;
		}
	}
</style>