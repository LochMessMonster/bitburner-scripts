/** @param {import("..").NS } ns */

export async function main(ns) {
    let rackSizeLimit = ns.getPurchasedServerLimit();
    let rackRamLimit = ns.getPurchasedServerMaxRam();
    const testHost = "srv-1"

    let ram = 16;

    let costBuy, costUpgrade, totalCostBuy, totalCostUpgrade, costDiff, totalCostDiff;
    totalCostBuy = totalCostUpgrade = 0;

    while (ram < rackRamLimit) {
        costBuy = ns.getPurchasedServerCost(ram);
        costUpgrade = ns.getPurchasedServerUpgradeCost(testHost, ram);
        totalCostBuy += costBuy;
        totalCostUpgrade += costUpgrade;

        costDiff = ((costBuy - costUpgrade)/costBuy)


        ns.tprintf(
            "%s | Buy: $ %s | Up : $ %s | Diff: %s p",
            ns.formatRam(ram), 
            ns.formatNumber(costBuy),
            ns.formatNumber(costUpgrade),
            ns.formatPercent(costDiff)
        );
        ram *= 2;
        if (ram >= rackRamLimit) ram = rackRamLimit;
    }
    totalCostDiff = ((totalCostBuy - totalCostUpgrade)/totalCostBuy) 
    ns.tprintf(
        "Total | Buy: $ %s | Up: $ %s | Diff: %s p",
        ns.formatNumber(totalCostBuy),
        ns.formatNumber(totalCostUpgrade),
        ns.formatPercent(totalCostDiff)
    );
    ns.tprint("Total Buy Cost for Full Rack : $" + ns.formatNumber(totalCostBuy * rackSizeLimit) );
    ns.tprint("Total Up Cost for Full Rack : $" + ns.formatNumber(totalCostUpgrade * rackSizeLimit) );
    // ns.tprint("Total Diff for Full Rack : % " + ns.formatPercent((totalCostDiff * rackSizeLimit)/100) );
}