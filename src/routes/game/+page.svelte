<script lang="ts">
  import { onMount } from 'svelte';
  import { launch } from '$lib/game';

  onMount(() => {
    // id가 'game'인 div 요소에 Phaser 게임을 실행합니다.
    launch('game');
  });
</script>

<div id="game" />

<style>
  /* 게임 컨테이너가 전체 화면을 차지하도록 설정 */
  :global(body, html) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  #game {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>