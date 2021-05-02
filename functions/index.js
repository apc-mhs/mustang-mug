const functions = require("firebase-functions");

let ssrServerServer;
exports.ssrServer = functions.https.onRequest(async (request, response) => {
    if (!ssrServerServer) {
        functions.logger.info("Initializing SvelteKit SSR Handler");
        ssrServerServer = require("./ssrServer/index").default;
        functions.logger.info("SvelteKit SSR Handler initialised!");
    }
    return await ssrServerServer(request, response);
});
