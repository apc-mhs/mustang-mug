<script>
import { getOptionIdsFromProperties } from "$lib/msb/cart";


export let cartPayments;
export let pickUpTime;

$: payment = cartPayments[0];
$: paymentItems = cartPayments[0].cartPaymentItems;
</script>

<div class="order">
    <h2>Order for {paymentItems[0].studentName}</h2>
    <h3>Items</h3>
    <div class="items">
        {#each paymentItems as item (item.reference)}
            <div class="item">
                <h4>{item.itemName}</h4>
                <p>Quantity: {item.quantity}</p>
                {#if getOptionIdsFromProperties(item.properties).length > 0}
                    <h4>Options:</h4>
                    <ul>
                        {#each getOptionIdsFromProperties(item.properties) as optionId}
                            <li>{optionId}</li>
                        {/each}
                    </ul>
                {/if}
            </div>
        {/each}
    </div>
    <p>Confirmation code: {payment.orderId}</p>
</div>

<style>
.order {
    background-color: white;
    padding: 10px 20px;
    border-radius: 5px;
}

.items {
    display: flex;
    flex-flow: column nowrap;
    padding: 5px;
    gap: 5px 0px;
}

.item {
    background-color: gray;
    padding: 5px;
    border-radius: 5px;
}
</style>
