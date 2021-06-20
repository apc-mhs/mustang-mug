<script>
import app from '$lib/firebase/firebase';
import { onDestroy } from 'svelte';
import OrderGroup from '$lib/components/orders/OrderGroup.svelte';
import Order from '$lib/components/orders/Order.svelte';

let orders = {};
let groupedOrders = {};

$: {
    for (let order of Object.values(orders)) {
        if (!groupedOrders[order.pickUpTime]) {
            groupedOrders[order.pickUpTime] = [order];
        } else {
            groupedOrders[order.pickUpTime] = [
                ...groupedOrders[order.pickUpTime],
                order,
            ];
        }
    }
}

const unsubscribe = app
    .firestore()
    .collection('orders')
    .onSnapshot(async (snapshot) => {
        for (let change of snapshot.docChanges()) {
            if (change.type === 'added' || change.type === 'modified') {
                const msbPaymentData = await fetch(
                    '/dashboard/orders.json?id=' + change.doc.id
                ).then((res) => res.json());
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

onDestroy(unsubscribe);
</script>

<div class="orders">
    <h1>Orders</h1>
    {#each Object.keys(groupedOrders) as groupKey (groupKey)}
        <OrderGroup key={groupKey} orders={groupedOrders[groupKey]} let:order>
            <Order {...order} />
        </OrderGroup>
    {/each}
</div>

<style>
.orders {
    padding: 10px;
}
</style>
