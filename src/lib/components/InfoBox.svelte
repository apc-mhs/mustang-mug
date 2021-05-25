<script>
import tippy from '$lib/tippy';
import 'tippy.js/animations/shift-away-subtle.css';

export let content;

const infoBoxProps = {
    content,
    placement: 'top',
    arrow: true,
    duration: [100, 100],
    animation: 'shift-away-subtle',
    touch: ['hold', 450],
    trigger: 'mouseenter',
}
</script>

<span class="info-box-launcher" use:tippy={infoBoxProps}>
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