<script>
import Menu from '$lib/components/Menu.svelte';
import menuQuery from './_menuQuery';

let skeleton = true;
const skeletonItems = new Array(10).fill(5).map((_) => {
    return {
        name: Math.random().toString().substring(0, 5),
        price: 0,
        stock: false,
        image: 'menu-item-placeholder.jpg',
    };
});

let items = [];
menuQuery()
    .then((data) => {
        items = data;
        skeleton = false;
    });
</script>

<section>
    <Menu {skeleton} items={skeleton ? skeletonItems : items} />
</section>

<style>
section {
    background-color: rgb(71, 70, 70);
    color: white;
}
</style>
