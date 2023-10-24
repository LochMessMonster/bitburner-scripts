import { NS } from "@ns";

import * as Defaults from "scripts/utils/defaults"
import { getPlayerMoney } from "scripts/utils/player-utils"

export async function main(ns: NS): Promise<void> {
    purchaseNodes(ns);
    await ns.sleep(2000);
    upgradeNodes(ns);
    await ns.sleep(2000);
}

function purchaseNodes (ns: NS) {
    let numNodes = ns.hacknet.numNodes();

    if (numNodes > 0) {
        let maxNodes = Defaults.hacknetNodeLimit;

        if (numNodes >= maxNodes) { return; }

        // amount of nodes affordable
        let countAffordable = Math.floor(getPlayerMoney(ns) / ns.hacknet.getPurchaseNodeCost());

        // clamp down
        countAffordable = Math.min(countAffordable, maxNodes);

        // purchase
        for (let i = numNodes; i < countAffordable ; i++) {
            let index =  ns.hacknet.purchaseNode();
            if (index == -1) {
                break
            }
        }
    }
}

function upgradeNodes (ns: NS) {
    let numNodes = ns.hacknet.numNodes();

    for (let i = 0; i < numNodes; i++) {
        let nodeStats = ns.hacknet.getNodeStats(i);

        // Upgrade level
        if (nodeStats.level < Defaults.hacknetLevelLimit) {
            let upgradeSucess = ns.hacknet.upgradeLevel(i);
            if (!upgradeSucess) {
                return;
            }
        }

        // Upgrade RAM
        if (nodeStats.ram < Defaults.hacknetRamLimit) {
            let upgradeSucess = ns.hacknet.upgradeRam(i);
            if (!upgradeSucess) {
                return;
            }
        }
    }
}