import { NS } from "@ns";

// import * as Defaults from "../utils/defaults"
import * as Defaults from "scripts/utils/defaults"
// import {uploadScripts, loadServerFile} from "scripts/utils/hack-utils"

export async function main(ns: NS): Promise<void> {
    // server rack data
    let srvList = ns.getPurchasedServers();
    let srvCount =  (srvList.length > 0) ? srvList.length : 0;
    let emptySlots = ns.getPurchasedServerLimit() - srvCount;
    
    
    // Fill up rack if not filled
    let rackHasEmptySlots = emptySlots > 0;
    if (rackHasEmptySlots) {
        fillRack(ns, Defaults.psrvRamMin, emptySlots, srvCount);
        await ns.sleep(5000);
    }

    // Check if has servers
    emptySlots = ns.getPurchasedServerLimit() - srvCount;
    if (emptySlots != 0) {
        // Upgrade RAM of servers in rack if not at max
        let rackCanUpgrade = !isRackAtMaximumRam(ns);
        if (rackCanUpgrade)  {
            upgradeRack(ns);
            await ns.sleep(5000);
        }
    }



    ns.print("Count: " + ns.getPurchasedServers().length)
    ns.print("Rack Filled: " + isRackFull(ns));
    ns.print("Max Ram: " + isRackAtMaximumRam(ns));
    // return  {"FULL": !rackHasEmptySlots, "MAXED": !rackCanUpgrade }; 
}

// Fill up rack based on current money
function fillRack(ns: NS, ram: number, emptySlots: number, srvCount: number) : boolean {
    // money available leaving aside the reserve
    let moneyAvailable = ns.getServerMoneyAvailable(Defaults.home) - Defaults.reserveMoney;

    // No empty slots
    if (emptySlots <= 0) { return false; }

    let baseCost = ns.getPurchasedServerCost(ram);

    if (moneyAvailable > baseCost) {
        let purchaseAmt = Math.floor(moneyAvailable/baseCost);

        if (purchaseAmt > 0) {
            // if amt greather than available slots, clamp down
            if (purchaseAmt >= emptySlots) { purchaseAmt = emptySlots; }
    
            // purchase specified amt and update empty slot count
            emptySlots -= purchase(ns, purchaseAmt, ram, srvCount);
        }
    }

    
    // returns whether rack is empty
    return (emptySlots > 0);
}

// Upgrade servers in rack to maximum possible
function upgradeRack(ns:NS) {
    // Retrieve server list as it may have changed in fillRack()
    let srvList = ns.getPurchasedServers();

    // let isMaxRam = isRackAtMaximumRam(ns);
    let currentMoney = ns.getServerMoneyAvailable(Defaults.home) - Defaults.reserveMoney;
    const maxRam = Math.min(ns.getPurchasedServerMaxRam(), Defaults.psrvMaxMax);

    // // ram already maxed
    // if (isMaxRam) { return; }

    // Loop through and upgrade servers
    for (let server of srvList) {
        let ram = ns.getServerMaxRam(server)
        let newRam = ram * 2;
        let cost = ns.getPurchasedServerUpgradeCost(server, newRam);

        // if new ram is above max ram, skip this server
        if ( newRam > maxRam ) { continue; }
        // if cost is greater than budget
        if (cost > currentMoney ) { continue; }

        // Upgrade server and update money available if upgrade successful
        let isUpgraded = ns.upgradePurchasedServer(server, newRam);
        if (isUpgraded) {
            currentMoney -= cost;
        }

        // Break loop if out of money
        if (currentMoney == 0) { break; }
    }
}

// Purchase specified number of servers
function purchase(ns: NS, amount: number, ram: number, srvCount: number) : number {
    let hostname : string;

    // Determine new count of servers
    let purchased = 0;
    let newCount = srvCount + amount;
    for (let i = srvCount; i < newCount; i++) {
        hostname = Defaults.psrvPrefix + i;
        let newServer = ns.purchaseServer(hostname, ram);
        
        // if hostname was returned, it will not be empty
        if (newServer !== "") {
            // update count
            purchased++;
        } else {
            // something went wrong
            break;
        }
    }
    return purchased;
}


/**
 * Check if all servers in server rack are at maximum RAM. 
 * @param ns NS API
 * @param srvList List of purchased servers - NOT in use
 * @returns True if all servers in server rack are at Max Ram; false otherwise.
 */
function isRackAtMaximumRam(ns: NS) : boolean {
    let srvList = ns.getPurchasedServers();
    const maxRam = Math.min(ns.getPurchasedServerMaxRam(), Defaults.psrvMaxMax,);

    let isMaxed = true;
    for (const srv of srvList) {
        if (ns.getServerMaxRam(srv) < maxRam) {
            isMaxed = false;
            break;
        }
    }
    return isMaxed;
}

/**
 * Check if server rack has been filled.
 * @param ns NS API
 * @returns True if there are no slots in rack; false otherwise
 */
function isRackFull(ns:NS) {
    let emptySlots = ns.getPurchasedServerLimit() - ns.getPurchasedServers().length
    return (emptySlots == 0)
}
