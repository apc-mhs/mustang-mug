<script>
import Menu from "$lib/components/menu/Menu.svelte";
import { getDocuments } from "$lib/query";


let menuItems = [];
getDocuments('items')
    .then((items) => menuItems = items);
</script>



<style>

</style>
