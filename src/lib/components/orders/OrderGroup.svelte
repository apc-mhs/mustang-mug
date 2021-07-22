<script>
import getFirebase from "$lib/firebase";


export let key;
export let orders;

const formatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

let date;
$: getFirebase()
    .then(({ firebase }) => {
        date = firebase.firestore.Timestamp.fromMillis(key).toDate();
    });
</script>

<div class="order-group">
    <h2>Orders to be picked up at {date ? formatter.format(date) : 'Loading...'}</h2>
    <hr>
    <div class="orders">
        {#each orders as order (order.id)}
            <slot {order} />
        {/each}
    </div>
</div>


<style>
.order-group {
    margin: 10px 0px;
}

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

.orders {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    gap: 15px 10px;
}
</style>
