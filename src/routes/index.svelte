<script>
import app, { signInAnon, currentUser } from "$lib/firebase";


console.log(app.firestore().doc('items'));
async function signIn() {
    console.log(await signInAnon());
}
signIn();
</script>

<h1>Mustang Mug</h1>
{JSON.stringify($currentUser)}
