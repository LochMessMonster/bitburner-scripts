
const home              = "home"
const scriptManager     = "scripts/hack/manager.js";
const scriptXpFarm      = "scripts/hack/xp-farm.js";
const scriptHack        = "scripts/hack/hack-server.js";
const scriptStartAuto   = "scripts/hack/start-automate.js";
const scriptStopAuto    = "scripts/hack/stop-automate.js";
const scriptSpider      = "scripts/hack/spider.js";
const scriptShopping    = "scripts/purchase/shopping.js"
const scriptServerRack  = "scripts/purchase/server-rack.js";
// const scriptSetup = "upload.js";

const filepathTarget    = "servers/nuked.txt"
const filepathFailed    = "servers/failed.txt"
const filepathBlacklist = "servers/blacklist.txt"
const defaultThreads    = 1;

/** @param {import(".").NS } ns */
export async function main(ns) {
    // Enforce only 1 instance of manager
    // if (ns.isRunning(scriptManager)) {
    //     // ns.killall(home, true);
    //     ns.tprint("Please stop other instances of manager.")
    //     ns.exit();
    // }

    // Calculate time since last augment reset
    let timeSinceLastAugMs = Math.abs(Date.now() - ns.getResetInfo().lastAugReset);
    let timeSinceLastAugMin = Math.floor( (timeSinceLastAugMs/1000)/60 );
    ns.tprintf("Time since last aug reset: %ds | %d mins | %d hrs", timeSinceLastAugMs/1000, timeSinceLastAugMin, timeSinceLastAugMin/60 );
    
    // if aug-reset was less than 10mins, cold start
    if (timeSinceLastAugMin < 10) {
        ns.tprint("Cold Start");
        await coldStart(ns);
    }
    ns.tprint("Starting manager");
    await manage(ns);

    // Exit message
    ns.tprint("Manager has stopped.");
}

async function manage(ns) {
    const levelStep = 100, moneyStep = 5000000;
    let levelCurr, moneyCurr;

    let doManage = true;
    while (doManage) {
        hotStart(ns);
        await ns.sleep(600000); // 10 min

        // purchase and fill up server rack
        // ns.run(scriptServerRack);
        // purchase useful items
        // ns.run(scriptShopping);

        // If a 'threshold' is reached, notify player and stop managing.
        levelCurr = ns.getHackingLevel();
        moneyCurr = ns.getServerMoneyAvailable("home");
        if( (levelCurr % levelStep == 0 ) || (moneyCurr % moneyStep == 0)) {
            ns.tprint("Hacking level reached: " + levelCurr);
            ns.tprint("Money reached: " + moneyCurr);
            doManage = false;
            
            await ns.alert("Set threshold reached. Stopping manager.")
        }
    }

}

/** @param {import(".").NS } ns */
async function hotStart (ns) {
    ns.run(scriptStopAuto, defaultThreads, scriptHack, filepathTarget);
    ns.run(scriptSpider);
    await ns.sleep(15000); // 15 sec
    ns.run(scriptStartAuto, defaultThreads, scriptHack, filepathTarget);
}

// Cold starts are resets. The goal is to accumulate money and hack-level till 100
/** @param {import(".").NS } ns */
async function coldStart (ns) {
    const levelThreshold = 100;
    let levelCurr = 0;

    // Open up early servers
    ns.run(scriptSpider);
    await ns.sleep(15);

    while (levelCurr <= levelThreshold) {
        levelCurr = ns.getHackingLevel();
        // Start XP farm
        if (levelCurr < levelThreshold) {
            ns.run(scriptXpFarm); // is this needed?
            hotStart(ns);
        }
        await ns.sleep(300000); // 5 mins
    }

    ns.tprintf("Hacking level %d reached. Cold start finished.", levelCurr);
}