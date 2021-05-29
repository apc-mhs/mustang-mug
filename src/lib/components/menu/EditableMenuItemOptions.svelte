<script>
import { slide } from 'svelte/transition';
import Icon from '$lib/components/utility/Icon.svelte';
import { horizontalSlide } from '$lib/transition';
import { browser } from '$app/env';
import { numberFormatter } from '$lib/utils';
import app, { firebase } from '$lib/firebase/firebase';
import tippy from '$lib/tippy';

export let options;
export let noOptionsMessage = '';
export let optionsMessage = '';

let optionsData = [];

if (browser) {
    const validOptionIds = options.map((option) => option.id);

    const queries = [];
    // Maximum 10 elements in a firestore 'in' query
    for (let i = 0; i < Math.ceil(validOptionIds.length / 10); i++) {
        const offset = i * 10;
        queries.push(
            getOptionsForOptionIds(validOptionIds.slice(offset, offset + 10))
        );
    }

    Promise.all(queries)
        .then((snapshots) => snapshots.flatMap((snapshot) => snapshot.docs))
        .then((docs) => docs.map((doc) => doc.data()))
        .then((data) => (optionsData = data));
}

function getOptionsForOptionIds(optionIds) {
    return app
        .firestore()
        .collection('options')
        .where(firebase.firestore.FieldPath.documentId(), 'in', optionIds)
        .get();
}

function toggle(optionIndex) {
    optionsData[optionIndex].stock = !optionsData[optionIndex].stock;
}
</script>

<div class="item-options" transition:slide|local>
    <p>{optionsData.length === 0 ? noOptionsMessage : optionsMessage}</p>
    <div class="options-list">
        {#each optionsData as option, i (i)}
            <div
                class="option"
                on:click={() => toggle(i)}
                transition:slide|local
                use:tippy={!option.stock ? { content: 'This option is marked out of stock.', maxWidth: 150 } : undefined}
                class:out-of-stock={!option.stock}>
                {#if option.stock}
                    <Icon name="check" width="16" height="16" />
                {:else}
                    <Icon name="close" width="16" height="16" />
                {/if}
                <p>{option.name}</p>
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
    gap: 0px 2px;
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
    color: skyblue;
    /* Set padding left-right to take off 16 (width of checkmark) total pixels */
    padding: 5px 8px;
}

.option.out-of-stock {
    color: red;
}
</style>
