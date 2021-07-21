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

$: {
    for (let order of Object.values(orders)) {
        const pickUpTimeSeconds = order.pickUpTime.toMillis();
        if (!groupedOrders[pickUpTimeSeconds]) {
            groupedOrders[pickUpTimeSeconds] = [order];
        } else {
            groupedOrders[pickUpTimeSeconds] = [
                ...groupedOrders[pickUpTimeSeconds],
                order,
            ];
        }
    }
}

let playOrderSounds = false;
let alert;
if (browser) {
    alert = new Audio('/audio/alert.mp3');
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
                        const msbPaymentData = await fetch(
                            '/dashboard/orders.json?id=' + change.doc.data().cartId
                        ).then((res) => res.json());

                        if (browser && playOrderSounds) {
                            alert.play();
                        }
                        orders[change.doc.id] = {
                            id: change.doc.id,
                            cartPayments: msbPaymentData,
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

onDestroy(unsubscribe);
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
        <OrderGroup key={groupKey} orders={groupedOrders[groupKey]} let:order>
            <Order {...order} />
        </OrderGroup>
    {/each}
</div>

<style>
.orders {
    padding: 10px;
    background-color: gray;
    min-height: calc(100% - 20px);
    margin: 10px;
}
</style>
