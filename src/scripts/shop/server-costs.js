/** @param {import("..").NS } ns */

export async function main(ns) {
    let rackSizeLimit = ns.getPurchasedServerLimit();
    let rackRamLimit = ns.getPurchasedServerMaxRam();
    const testHost = "srv-1"

    let ram = 16;

    let costBuy, costUpgrade, costIncUpgrade;
    let totalCostBuy, totalCostUpgrade, totalCostIncUpgrade;
    totalCostBuy = totalCostUpgrade = totalCostIncUpgrade = 0;

    ns.tprintf("| %10s | %10s | %10s | %10s |", "-", "Buy", "Upgrade", "IncUpgrade")
    ns.tprintf("| %10s | %10s | %10s | %10s |", "---", "---", "---", "---")
    while (ram < rackRamLimit) {
        costBuy = ns.getPurchasedServerCost(ram);
        costUpgrade = ns.getPurchasedServerUpgradeCost(testHost, ram);
        costIncUpgrade = getUpgradeCost(ns, ram/2, ram);

        totalCostBuy += costBuy;
        totalCostUpgrade += costUpgrade;
        totalCostIncUpgrade += costIncUpgrade;

        ns.tprintf(
            "| %10s | $ %10s | $ %10s | $ %10s |",
            ns.formatRam(ram), 
            ns.formatNumber(costBuy),
            ns.formatNumber(costUpgrade),
            ns.formatNumber(costIncUpgrade)
        );
        ram *= 2;
        if (ram >= rackRamLimit) ram = rackRamLimit;
    }
    totalCostDiff = ((totalCostBuy - totalCostUpgrade)/totalCostBuy) 
    ns.tprintf(
        "| %10s |  %10s | $ %10s |$ %10s |",
        "Total",
        ns.formatNumber(totalCostBuy),
        ns.formatNumber(totalCostUpgrade),
        ns.formatPercent(totalCostIncUpgrade)
    );
    ns.tprintf("| %10s | %10s | %10s | %10s |", "---", "---", "---", "---");

    ns.tprint("Total Buy Cost for Full Rack : $" + ns.formatNumber(totalCostBuy * rackSizeLimit) );
    ns.tprint("Total Up Cost for Full Rack : $" + ns.formatNumber(totalCostUpgrade * rackSizeLimit) );
    ns.tprint("Total Inc upgrade Cost for Full Rack : $" + ns.formatNumber(totalCostIncUpgrade * rackSizeLimit) );
    // ns.tprint("Total Diff for Full Rack : % " + ns.formatPercent((totalCostDiff * rackSizeLimit)/100) );
}

// ns.getPurchasedServerUpgradeCost() uses existing server's ram to calculate cost
// so the cost of upgrade to 64gb would be for upgrading from 8 -> 64
// But I need incremental cost (each pass increments the server ram by factor of 2)
// 
// Ripped the upgrade calc from game src-code
// Might be better to store prev cost instead of making so many calls, but meh
function getUpgradeCost (ns, oldRam, newRam) {

    return ns.getPurchasedServerCost(newRam) - ns.getPurchasedServerCost(oldRam);
}