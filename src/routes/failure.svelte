<script>
import { browser } from '$app/env';
import { currentUser } from '$lib/auth';
import Icon from '$lib/components/utility/Icon.svelte';
import getFirebase from '$lib/firebase';

let resultCodes = null;
let resultStatus = null;
$: if (browser && $currentUser) {
    getFirebase().then(({ app }) => {
        app.firestore()
            .collection('carts')
            .doc($currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    const data = snapshot.data();
                    resultCodes = data.resultCodes || [];
                    resultStatus = data.resultStatus;
                } else {
                    resultCodes = [];
                }
            })
            .catch((err) => (resultCodes = []));
    });
}
</script>

<svelte:head>
    <title>Failure - Mustang Mug</title>
</svelte:head>

<section>
    <h1>
        <Icon name="close" --vertical-align="middle"/> Your order failed to go through :(. There are a number of reasons this could
        have occured. Check the result codes below and try again.
    </h1>
    <h2>Results of your payment</h2>
    {#if resultStatus}
    <p>Result status: {resultStatus}</p>
    {/if}
    {#if resultCodes !== null}
        <ul>
            {#each resultCodes as resultCode, i (i)}
                <li><strong>Result {i + 1}</strong>: {resultCode}</li>
            {:else}
                <li>No results. Your cart may have been deleted! Try placing the order again; you were not already charged.</li>
            {/each}
        </ul>
    {:else}
        <p>Loading resultCodes...</p>
    {/if}
</section>

<style>
* {
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    color: white;
}

section {
    padding: 20px 40px;
}
</style>
