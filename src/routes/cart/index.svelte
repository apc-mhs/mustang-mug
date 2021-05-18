<script>
let checkoutStatus = 'Unknown';

async function checkout() {
    checkoutStatus = await fetch('/checkout', { method: 'POST' }).then((res) =>
        res.text()
    );
}
</script>

<h1>Welcome to the cart</h1>
<button on:click={checkout}>Checkout</button>
<p>{checkoutStatus}</p>

<style>
* {
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    color: white;
}
</style>
