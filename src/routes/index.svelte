<script>
import { currentUser } from '$lib/auth';
import Menu from '$lib/components/Menu.svelte';
</script>

<body>
<h1>Mustang Mug!</h1>
<p>User id: {$currentUser ? $currentUser.uid : 'None'}</p>
<Menu />
</body>

<style>
body {
    background-color: rgb(71, 70, 70);
    color: white;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}
</style>
