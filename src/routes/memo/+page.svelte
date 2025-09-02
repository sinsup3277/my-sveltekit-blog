<script lang="ts">
	import { onMount } from 'svelte';

	let title = '';
	let content = '';
	let memos: { slug: string; title: string }[] = [];

	onMount(async () => {
		const res = await fetch('/api/memos');
		if (res.ok) {
			memos = await res.json();
		}
	});

	async function saveMemo() {
		const res = await fetch('/api/memos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, content })
		});

		if (res.ok) {
			const newMemo = await res.json();
			memos = [...memos, newMemo].sort((a, b) => a.title.localeCompare(b.title));
			title = '';
			content = '';
		} else {
			if (res.status === 409) {
				const error = await res.json();
				alert(error.message);
			} else {
				alert('메모 저장에 실패했습니다.');
			}
		}
	}
</script>

<div class="memo-container">
	<h1>&lt; 메모장 &gt;</h1>
	<p>여기에 당신의 메모를 작성하세요.</p>

	<form on:submit|preventDefault={saveMemo} class="memo-form">
		<input type="text" bind:value={title} placeholder="제목" required />
		<textarea bind:value={content} placeholder="내용" rows="5" required />
		<button type="submit" class="btn-primary">저장</button>
	</form>

	<hr />

	<h2>작성된 메모</h2>
	<ul class="memo-list">
		{#each memos as memo}
			<li>
				<a href="/memo/{memo.slug}" class="memo-card">
					<span>{memo.title}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><polyline points="9 18 15 12 9 6" /></svg
					>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.memo-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}

	.memo-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 2rem 0;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		background-color: var(--bg-color);
		color: var(--text-color);
		font-size: 1rem;
		transition: border-color 0.2s ease;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 2px var(--primary-color-light);
	}

	.btn-primary {
		align-self: flex-end;
		padding: 0.75rem 1.5rem;
		background-color: var(--primary-color);
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		transition: background-color 0.2s ease;
	}

	.btn-primary:hover {
		background-color: var(--primary-color-dark);
	}

	h2 {
		margin-top: 2rem;
	}

	.memo-list {
		list-style: none;
		padding: 0;
		margin-top: 1rem;
		display: grid;
		gap: 0.75rem;
	}

	.memo-card {
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
	}

	.memo-card:hover {
		border-color: var(--primary-color);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.memo-card span {
		font-weight: 500;
	}

	.memo-card svg {
		color: var(--text-color-light);
	}

	@media (max-width: 600px) {
		.memo-container {
			padding: 0.5rem;
		}
		.btn-primary {
			width: 100%;
		}
	}
</style>