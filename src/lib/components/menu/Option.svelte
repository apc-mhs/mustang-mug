<script>
import tippy from '$lib/tippy';
import { fade } from 'svelte/transition';
import Icon from '$lib/components/utility/Icon.svelte';

export let option;
export let hoverMessage;
export let iconName = 'check';
</script>

<div
    class="option"
    class:out-of-stock={option.stock !== undefined && !option.stock}
    transition:fade|local={{ duration: 250 }}
    on:click
    use:tippy={hoverMessage}>
    <Icon name={iconName} width="16" height="16" />
    <p>{option.name}</p>
</div>

<style>
.option {
    box-sizing: content-box;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    gap: 0px 2px;
    border: 2px solid currentColor;
    border-radius: 20px;
    height: 16px;
    color: white;
    font-size: 13px;
    padding: 5px 16px;
    color: gray;
    cursor: pointer; /* Transition function equal to cubicOut (in horizontalSlide) */
    transition: padding 400ms cubic-bezier(0.215, 0.61, 0.355, 1);
    color: skyblue; /* Set padding left-right to take off 16 (width of checkmark) total pixels */
    padding: 5px 8px;
}
.option.out-of-stock {
    color: red;
}
</style>
