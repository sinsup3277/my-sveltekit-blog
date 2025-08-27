<script>
    let nextColorIndex = 0;

    function changeBackgroundColor() {
        const colors = ['#f0f8ff', '#faebd7', '#00ff7f', '#ffebcd', '#add8e6'];
        document.body.style.backgroundColor = colors[nextColorIndex];
        nextColorIndex = (nextColorIndex + 1) % colors.length;
    }
</script>

<div id="wrapper">
    <p>이것은<br>메인 페이지입니다.</p>
    <div id="backgroundChange"><button on:click={changeBackgroundColor}>배경색 변경</button></div><br><br><br>
</div>

<style>
    /* Specific styles for this page can go here */
</style>