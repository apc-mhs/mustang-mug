<script>
export let cartPayments;
export let pickUpTime;

console.log(cartPayments);
</script>

<div class="order">
    {#each cartPayments[0].cartPaymentItems as item (item.reference)}
        <h3>{item.itemName}</h3>
        <p></p>
    {/each}
</div>

<style>
.order {
    background-color: white;
    padding: 10px 20px;
    border-radius: 5px;
}
</style>
