<script>
import getFirebase from '$lib/firebase';
import { onDestroy } from 'svelte';
import OrderGroup from '$lib/components/orders/OrderGroup.svelte';
import Order from '$lib/components/orders/Order.svelte';
import { browser } from '$app/env';
import Button from '$lib/components/input/Button.svelte';
import Icon from '$lib/components/utility/Icon.svelte';

let orders = {};
let groupedOrders = {};
let completedOrders = [];

$: {
    const newGroupedOrders = {};
    for (let order of Object.values(orders)) {
        const pickUpTimeSeconds = order.pickUpTime.toMillis();
        if (newGroupedOrders[pickUpTimeSeconds] === undefined) {
            newGroupedOrders[pickUpTimeSeconds] = [order];
        } else {
            newGroupedOrders[pickUpTimeSeconds] = [
                ...newGroupedOrders[pickUpTimeSeconds],
                order,
            ];
        }
    }
    groupedOrders = newGroupedOrders;
}

let playOrderSounds = false;
let alert;
if (browser) {
    alert = new Audio('/audio/alert.wav');
}

let unsubscribe = () => {};
if (browser) {
    getFirebase().then(({ app }) => {
        unsubscribe = app
            .firestore()
            .collection('orders')
            .onSnapshot(async (snapshot) => {
                for (let change of snapshot.docChanges()) {
                    if (change.type === 'added' || change.type === 'modified') {
                        // Make sure to check if the orders list DOESN'T contain this id
                        // That way orders that are "uncompleted" don't play a sound
                        if (browser && playOrderSounds && change.type === 'added' && !orders[change.doc.id]) {
                            alert.play();
                        }
                        orders[change.doc.id] = {
                            id: change.doc.id,
                            ...change.doc.data(),
                        };
                    } else {
                        delete orders[change.doc.id];
                        orders = orders;
                    }
                }
            });
    });
}

async function orderCompleteHandler(groupKey, order) {
    groupedOrders[groupKey] = groupedOrders[groupKey].filter((groupedOrder) => groupedOrder !== order);
    completedOrders = [...completedOrders, order];

    const { app } = await getFirebase();
    app.firestore()
        .collection('orders')
        .doc(order.id)
        .delete();
}

async function orderUncompleteHandler(order) {
    completedOrders = completedOrders.filter((completedOrder) => completedOrder !== order);
    orders[order.id] = order;

    const { app } = await getFirebase();
    app.firestore()
        .collection('orders')
        .doc(order.id)
        .set(order);
}

onDestroy(() => unsubscribe());
</script>

<div class="orders">
    <h1>
        Orders
        <Button
            on:click={() => playOrderSounds = !playOrderSounds}
            --background-color={playOrderSounds ? 'green' : 'unset'}
            --background-color-hover={playOrderSounds ? 'rgb(2, 100, 2)' : 'unset'}
            --background-color-active={playOrderSounds ? 'rgb(1, 77, 1)' : 'unset'}>
            <Icon name={playOrderSounds ? 'volume-up' : 'volume-down'}/>
            {playOrderSounds ? 'Playing' : 'Muting'} order sounds
        </Button>
    </h1>
    {#each Object.keys(groupedOrders) as groupKey (groupKey)}
        {#if groupedOrders[groupKey].length > 0}
            <OrderGroup key={groupKey} orders={groupedOrders[groupKey]} let:order>
                <Order {...order} on:complete={() => orderCompleteHandler(groupKey, order)} />
            </OrderGroup>
        {/if}
    {/each}
    {#if completedOrders.length > 0}
        <OrderGroup title={'Completed Orders'} orders={completedOrders} let:order>
            <Order {...order} on:complete={() => orderUncompleteHandler(order)} completed={true} />
        </OrderGroup>
    {/if}
</div>

<style>
.orders {
    padding: 10px;
    background-color: gray;
    min-height: calc(100% - 20px);
    margin: 10px;
}
</style>
