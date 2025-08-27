<script lang="ts">
    interface GalleryItem {
        src: string;
        alt: string;
        title: string;
        href: string;
    }

    const galleryItems: GalleryItem[] = [
        {
            src: "/portfolio/alert-boxes/alert-boxes-thumb.png",
            alt: "파스텔톤 알람 박스 썸네일",
            title: "파스텔톤 알람 박스",
            href: "/portfolio/alert-boxes/alert-boxes.html"
        },
        {
            src: "/portfolio/arrange/arrange-thumb.png",
            alt: "드래그&드롭 글 정렬 썸네일",
            title: "드래그&드롭 글 정렬",
            href: "/portfolio/arrange/arrange.html"
        }
        // 여기에 새로운 작품을 추가하세요.
        // {
        //     src: "/path/to/your/new-work-thumb.png",
        //     alt: "새 작품 썸네일",
        //     title: "새로운 작품",
        //     href: "/path/to/your/new-work"
        // }
    ];
</script>

<div id="wrapper">
    <main>
        <h1>작품 갤러리</h1>
        <div class="gallery">
            {#each galleryItems as item}
                <a href={item.href} target="_blank" rel="noopener noreferrer" class="item-link">
                    <div class="item">
                        <img src={item.src} alt={item.alt} class="thumbnail">
                        <h4>{item.title}</h4>
                    </div>
                </a>
            {/each}
        </div>
    </main>
</div>

<style>
    .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 반응형 그리드 */
        gap: 20px; /* 아이템 간 간격 */
        padding: 20px 0;
    }
    
    .item-link {
        text-decoration: none; /* 링크 기본 스타일 제거 */
        color: inherit; /* 부모 요소의 색상 상속 */
    }

    .item {
        background-color: var(--card-background); /* 카드 배경색 (기존 변수 사용) */
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease-in-out;
        text-align: center;
        padding-bottom: 15px; /* 텍스트와 하단 간격 */
        cursor: pointer; /* 클릭 가능한 요소임을 나타냄 */
        height: 100%; /* 부모 링크 요소에 맞춰 높이 채우기 */
        display: flex; /* 내부 요소 정렬을 위해 flex 사용 */
        flex-direction: column; /* 세로 방향으로 정렬 */
    }

    .item:hover {
        transform: translateY(-5px);
    }

    .item .thumbnail {
        width: 100%;
        height: 200px; /* 썸네일 높이 고정 */
        object-fit: cover; /* 이미지가 잘리지 않고 비율 유지 */
        display: block; /* 이미지 하단 여백 제거 */
        border-bottom: 1px solid var(--border-color); /* 썸네일 하단 구분선 */
        margin-bottom: 10px;
    }

    .item h4 {
        margin: 0;
        padding: 0 10px;
        flex-grow: 1; /* 남은 공간을 채우도록 하여 텍스트가 아래로 밀리지 않게 함 */
        display: flex;
        align-items: center; /* 세로 중앙 정렬 */
        justify-content: center; /* 가로 중앙 정렬 */
        color: var(--text-color); /* 텍스트 색상 (기존 변수 사용) */
        font-size: 1.1em;
        font-weight: 600;
    }

    /* 모바일 환경을 위한 추가 조정 */
    @media (max-width: 600px) {
        .gallery {
            grid-template-columns: 1fr; /* 작은 화면에서는 한 열로 */
        }
    }
</style>