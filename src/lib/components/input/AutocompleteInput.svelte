<script>
import { scale } from 'svelte/transition';

import Popper from '../utility/Popper.svelte';
import Input from './Input.svelte';

export let options = [];
export let selectedOption;
export let placeholder;
export let required = false;

$: suggestions = options.filter((option) => option !== selectedOption);
$: selectedOption = options.find((option) => option === value);
let value = '';
let popper;
let input;
let suggestionsElement;
let focusedSuggestion;

function handleKeydown(event) {
    if (!suggestions || suggestions.length <= 0) return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

    event.preventDefault();

    let suggestionIndex = 0;
    if (!focusedSuggestion) {
        focusedSuggestion = suggestions[0];
    } else {
        const direction = event.key === 'ArrowUp' ? -1 : 1;
        const suggestionUnsafeIndex =
            suggestions.indexOf(focusedSuggestion) + (1 * direction);
        // Either wrap the focus to the last element or wrap to the first
        suggestionIndex =
            suggestionUnsafeIndex < 0
                ? suggestions.length - 1
                : suggestionUnsafeIndex % suggestions.length;

        focusedSuggestion = suggestions[suggestionIndex];
    }

    suggestionsElement.children[suggestionIndex].focus();
}

function suggestionClickHandler(suggestion) {
    value = suggestion;
    popper.close();
}
</script>

<span class="input-wrapper" bind:this={input}>
    <Input
        {placeholder}
        {required}
        pattern={options.map((option) => `(${option})`).join('|')}
        bind:value
        on:focus={popper.open}
        on:keydown={handleKeydown}
        --font-size="16px" />
    <Popper
        bind:this={popper}
        reference={input}
        transition={scale}
        transitionProps={{ duration: 250, start: 0.85 }}>
        <div class="suggestions" bind:this={suggestionsElement}>
            {#each suggestions as suggestion, i (i)}
                <div
                    class="suggestion"
                    tabindex="0"
                    on:click={() => suggestionClickHandler(suggestion)}
                    on:keydown={(e) => e.key === 'Enter' ? suggestionClickHandler(suggestion) : handleKeydown(e)}>
                    <slot option={suggestion}>{suggestion}</slot>
                </div>
            {:else}
                <p>No options found.</p>
            {/each}
        </div>
    </Popper>
</span>

<style>
.input-wrapper {
    position: relative;
    display: inline-block;
}

.suggestions {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 5px;
    width: 150px;
    background-color: white;
    color: black;
    border-radius: 0px 0px 5px 5px;
    padding: 10px 0px;
}

.suggestion {
    transition: background-color 250ms ease;
    cursor: pointer;
    width: 100%;
    padding: 5px;
    text-align: center;
}

.suggestion:hover {
    background-color: rgb(214, 214, 214);
}

.suggestion:active, .suggestion:focus {
    background-color: rgb(177, 177, 177);
    outline: 0;
}
</style>
