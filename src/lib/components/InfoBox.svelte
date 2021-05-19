<script>
</script>

<span class="info-box-launcher">
    ?
    <div class="info-box">
        <slot />
    </div>
</span>

<style>
.info-box-launcher {
    position: relative;
    text-decoration: underline;
    text-decoration-style: dotted;
    cursor: help;
}

.info-box-launcher:hover > .info-box {
    opacity: 1;
    pointer-events: all;
}

.info-box {
    position: absolute;
    pointer-events: none;
    font-weight: normal;
    opacity: 0;
    width: 150px;
    padding: 5px;
    background-color: white;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0px 0px 6px 2px rgb(0, 0, 0, 0.15);
    transition: opacity 150ms ease;
}
</style>