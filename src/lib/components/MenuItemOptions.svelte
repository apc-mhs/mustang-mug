<script>
import { getDocuments, getDocumentsWhere } from "$lib/query";
import { firebase } from '$lib/firebase/firebase';
import Icon from './Icon.svelte';
import { horizontalSlide } from '$lib/transition';
import { browser } from "$app/env";


export let options;
export let message = '';
export let selectedOptions = [];

let optionsData = [];

// This should work but it doesn't: 
// https://stackoverflow.com/questions/55436558/using-fieldpath-documentid-equals-throws-cannot-have-inequality-filters-on
// getDocumentsWhere('options', (queryable) => {
//     return queryable.where(
//         firebase.firestore.FieldPath.documentId(),
//         'in',
//         options.map((option) => option.id)
//     );
// })

if (browser) {
    getDocuments('options')
        .then((data) => {
            const validOptionIds = options.map((option) => option.id);
            optionsData = data.filter((option) => validOptionIds.includes(option.id));
        });
}

function toggle(option) {
    const index = selectedOptions.indexOf(option);
    if (index === -1) {
        selectedOptions = [option, ...selectedOptions];
    } else {
        selectedOptions = selectedOptions.filter((selected) => selected !== option);
    }
}
</script>

<div>
    {message}
    <div class="options-list">
        {#each optionsData as option}
            <div class="option" on:click={toggle(option)} class:selected={selectedOptions.includes(option)}>
                {#if selectedOptions.includes(option)}
                    <span transition:horizontalSlide|local>
                        <Icon name="check" width="16" height="16" />
                    </span>
                {/if}
                <p>{option.name}</p>
            </div>
        {/each}
    </div>
</div>

<style>
.options-list {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0px 5px;
}

.option {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 0px 2px;
    border: 2px solid currentColor;
    border-radius: 15px;
    color: white;
    font-size: 13px;
    padding: 5px 8px;
    color: gray;
    cursor: pointer;
}

.option.selected {
    color: skyblue;
}
</style>