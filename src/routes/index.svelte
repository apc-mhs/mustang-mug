<script>
import Menu from '$lib/components/Menu.svelte';
import menuQuery from './_menuQuery';

const skeletonItems = new Array(10).fill(5).map((_) => {
    return {
        name: Math.random().toString().substring(0, 5),
        price: 0,
        stock: false,
        image: 'menu-item-placeholder.jpg',
    };
});
</script>

<section>
    {#await menuQuery()}
        <Menu skeleton items={skeletonItems} />
    {:then items}
        <Menu {items} />
    {/await}
</section>

<style>
section {
    background-color: rgb(71, 70, 70);
    color: white;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}
</style>
