<script>
export let key;
export let orders;

</script>

<div class="order-group">
    <h2>Orders to be picked up at {key}</h2>
    <hr>
    {#each orders as order (order.id)}
        <slot {order} />
    {/each}
</div>


<style>
hr {
    border: 0;
    height: 1px;
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.75),
        rgba(0, 0, 0, 0)
    );
    margin-bottom: 5px; 
}
</style>
