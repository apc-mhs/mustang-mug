<script>
import tippy from '$lib/tippy';

export let content;
</script>

<span class="info-box-launcher" use:tippy={content}>
    <slot>?</slot>
</span>

<style>
.info-box-launcher {
    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: help;
    border: 1px solid black;
    border-radius: 50%;
    width: 2ch;
    padding: 2px;
}
</style>
