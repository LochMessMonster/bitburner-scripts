
const serverPrefix = "srv-";
const home = "home"
const minRamPurchase = 8;
const upgradeLimit = "8 TB"//format

/** @param {import(".").NS } ns */
export async function main(ns) {
    let status = maintainRack(ns);
    ns.print(status);
    return status;
}

/** @param {import(".").NS } ns */
function maintainRack(ns) {
    let srvList = ns.getPurchasedServers();
    let srvCount = srvList.length;
    let emptySlots = ns.getPurchasedServerLimit() - srvCount;
    let currentMoney = ns.getServerMoneyAvailable(home);
    let rackHasEmptySlots = emptySlots > 0;
    let rackCanUpgrade = true;

    // If rack has empty slots, try to fill it
    if (rackHasEmptySlots) {
        rackHasEmptySlots = fillRack(ns, minRamPurchase, currentMoney, emptySlots, srvCount);
    }

    return  {"FULL": !rackHasEmptySlots, "MAXED": !rackCanUpgrade }; 
}

/** @param {import(".").NS } ns */
// Fill up rack based on current money
function fillRack(ns, ram, currentMoney, emptySlots, srvCount) {
    // No empty slots
    if (emptySlots <= 0) { return false; }

    let baseCost = ns.getPurchasedServerCost();
    let purchaseAmt = Math.floor(currentMoney/baseCost);

    // return empty if can't buy any
    if (purchaseAmt > 0) {
        // if amt greather than available slots, clamp down
        if (purchaseAmt >= emptySlots) { purchaseAmt = emptySlots; }

        // purchase specified amt and update empty slot count
        emptySlots -= purchase(ns, purchaseAmt, ram, srvCount);
    }
    // returns whether rack is empty
    return (emptySlots > 0);
}

function upgradeRack(ns, currentMoney, srvList) {}

// Purchase specified number of servers
/** @param {import(".").NS } ns */
function purchase(ns, amount, ram, srvCount) {
    let hostname;
    let purchased = 0;
    let newCount = srvCount + amount;

    for (let i = srvCount; i < newCount; i++) {
        hostname = serverPrefix + i;
        ns.purchaseServer(hostname, ram);
        purchased++;
    }
    return purchased;
}

// Upgrade all servers to specified ram
// function upgrade(ns, srv, ram) { }