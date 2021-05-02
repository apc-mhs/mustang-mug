const firebaseAdapter = require("svelte-adapter-firebase");

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	kit: {
		adapter: firebaseAdapter()
	}
};
