<script>
import { Time } from "$lib/purchase/window";


export let dayOfWeek;
export let purchaseWindows;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hours = {
    start: new Time(8),
    end: new Time(16)
};

// Turn milliseconds between start and end into array of length
// of number of 30 min increments between start and end
const times = new Array((hours.end.toDate() - hours.start.toDate()) / 1000 / 60 / 30)
    .fill(null)
    .map((_, i) => new Time(hours.start.hours, i * 30));
$: dayName = days[dayOfWeek];
</script>

<div class="purchase-schedule">
    <h3>{dayName}</h3>
    <table>
        <tr>
            {#each times as time, i (i)}
                <p>{new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(time.toDate())}</p>
            {/each}
        </tr>
    </table>
</div>

<style>
.purchase-schedule {
    max-width: 400px;
}

tr {
    display: flex;
    flex-flow: row nowrap;
}

tr > p {
    transform: rotate(-50deg);
    font-size: 12px;
    white-space: nowrap;
    margin: 0px -10px;
}
</style>
