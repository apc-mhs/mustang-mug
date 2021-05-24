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
    position: relative;
    text-decoration: underline;
    text-decoration-style: dotted;
    cursor: help;
}
</style>