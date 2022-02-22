const scripts = require('./scripts');

/**
 * Just maintenance scripts - just in case anything goes wrong or quick fixes and changes.
*/
async function maintain() {
    // Replace this with your maintenance script that you want to run.
    const res = await Promise.resolve(true);
    if (res) {
        console.log("Maintenance complete.");
    } else {
        console.log("Maintenance failed.");
    }
}

maintain();