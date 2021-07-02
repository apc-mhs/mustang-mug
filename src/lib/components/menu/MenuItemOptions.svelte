<script>
import { slide } from 'svelte/transition';
import Icon from '$lib/components/utility/Icon.svelte';
import { horizontalSlide } from '$lib/transition';
import { numberFormatter } from '$lib/utils';

export let options;
export let optionsMessage = '';
export let selectedOptions = [];


function toggle(option) {
    if (!option.stock) return;

    const index = selectedOptions.indexOf(option);
    if (index === -1) {
        selectedOptions = [option, ...selectedOptions];
    } else {
        selectedOptions = selectedOptions.filter(
            (selected) => selected !== option
        );
    }
}
</script>

<div class="item-options" transition:slide|local>
    <p>{optionsMessage}</p>
    <div class="options-list">
        {#each options as option}
            <div
                class="option"
                on:click={() => toggle(option)}
                class:selected={selectedOptions.includes(option)}>
                {#if selectedOptions.includes(option)}
                    <span transition:horizontalSlide|local class="icon">
                        <Icon name="check" width="16" height="16" />
                    </span>
                {/if}
                <p class="option-text">
                    {option.name}
                    {#if option.price}
                        - {numberFormatter.format(option.price)}
                    {/if}
                </p>
            </div>
        {/each}
    </div>
</div>

<style>
.item-options {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 5px 10px;
}

.item-options > p {
    margin-right: 5px;
}

.item-options > * {
    flex: 0 0 auto;
}

.options-list {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 3px 5px;
}

.option {
    box-sizing: content-box;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    border: 2px solid currentColor;
    border-radius: 20px;
    height: 16px;
    color: white;
    font-size: 13px;
    padding: 5px 16px;
    color: gray;
    cursor: pointer;
    /* Transition function equal to cubicOut (in horizontalSlide) */
    transition: padding 400ms cubic-bezier(0.215, 0.61, 0.355, 1);
}

.option .icon {
    margin-right: 2px;
}

.option.selected {
    color: rgba(114, 170, 233, 0.85);
    /* Set padding left-right to take off 18 (width of checkmark + 2px margin-right) total pixels */
    padding: 5px 7px;
}

.option-text {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
</style>
