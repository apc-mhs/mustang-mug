<script>
import { currentUser } from "$lib/auth";
</script>

<h1>Mustang Mug!</h1>
<p>User id: {$currentUser ? $currentUser.uid : 'None'}</p>
