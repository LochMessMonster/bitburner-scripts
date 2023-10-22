import { NS } from "@ns";

import * as Defaults from "scripts/utils/defaults";

export async function main(ns: NS): Promise<void> {
    // Enforce only 1 instance of manager
    // if (ns.isRunning(scriptManager)) {
    //     // ns.killall(home, true);
    //     ns.tprint("Please stop other instances of manager.")
    //     ns.exit();
    // }

    // Calculate time since last augment reset
    let timeSinceLastAugMs = Math.abs(Date.now() - ns.getResetInfo().lastAugReset);
    let timeSinceLastAugMin = Math.floor((timeSinceLastAugMs / 1000) / 60);

    ns.tprintf("Time since last aug reset: %ds | %d mins | %d hrs", timeSinceLastAugMs / 1000, timeSinceLastAugMin, timeSinceLastAugMin / 60);

    // Cold start if not at xp threshold
    if (ns.getHackingLevel() < Defaults.xpThreshold) {
        ns.tprint("Cold Start.");
        await coldStart(ns);
    }

    // Start normal manager
    ns.tprint("Starting manager");
    await manage(ns);

    // Exit message
    ns.tprint("Manager has stopped.");
}

async function manage(ns: NS) {
    const levelStep = 100, moneyStep = 5000000;
    let levelCurr, moneyCurr;

    let spiderDepth = 100;

    let doManage = true;
    while (doManage) {
        await hotStart(ns, spiderDepth);

        // increment spider depth
        spiderDepth += 100;

        // purchase and fill up server rack
        ns.run(Defaults.scriptServerRack);
        // purchase useful items
        // ns.run(scriptShopping);

        // If a 'threshold' is reached, notify player.
        levelCurr = ns.getHackingLevel();
        moneyCurr = ns.getServerMoneyAvailable("home");
        if ((levelCurr % levelStep == 0) || (moneyCurr % moneyStep == 0)) {
            ns.tprint("Hacking level reached: " + levelCurr);
            ns.tprint("Money reached: " + moneyCurr);
            // doManage = false;
        }
    }
}


async function hotStart(ns: NS, spiderDepth: number) {
    // Stop running scripts
    // ns.run(Defaults.scriptStop, 1);
    // Start spider
    ns.run(Defaults.scriptSpider, 1, spiderDepth);
    await ns.sleep(10000); // 10 sec - let the spider cook
    // Run auto-start

    let pid = ns.run(Defaults.scriptStart, 1);
    // if pid is 0, script failed
    if (pid == 0) {ns.tprint("ERROR"); ns.exit(); }

    // poll auto-start script if still running every 30 sec
    while (ns.isRunning(pid)) { await ns.sleep(30000); }
}

/**
 * Cold Start is run after a reset to farm HackLevel to specified threshold
 * @param ns NS API
 */
async function coldStart(ns: NS) {
    const levelThreshold = Defaults.xpThreshold;
    let levelCurr = 0;

    while (levelCurr <= levelThreshold) {
        levelCurr = ns.getHackingLevel();
        // Open up early servers
        ns.run(Defaults.scriptStop);
        ns.run(Defaults.scriptSpider);
        await ns.sleep(5000);   // 5 sec

        // Start XP farm
        ns.run(Defaults.scriptXPFarm);

        await ns.sleep(30000); // 30 sec
    }


    ns.tprintf("Hacking level %d reached. Cold start finished.", levelCurr);
    ns.run(Defaults.scriptStop);
}