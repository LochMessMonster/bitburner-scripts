/** 
 * @param {NS} ns 
 * @param {server} target-server
 */
export async function main(ns, server) {
    // pre-reqs - potentially import to util scripts
    ns.disableLog("getServerMoneyAvailable");
  
    var server;
    if (ns.args.length > 0) {
      server = ns.args[0];
      ns.tprint("Starting hack for: " + server);
    } else {
      ns.tprint("No server provided.")
      ns.exit();
    }
  
  
    var hack_chance, moneyCurr;
    while (true) {
      hack_chance = ns.hackAnalyzeChance(server);
      moneyCurr = ns.getServerMoneyAvailable(server);
  
      if (hack_chance < 0.69) {
        ns.printf("Reached min. hack-chance threshold (%d) on %s. Beginning weakening...", hack_chance, server);
        weakenSrv(ns, server);
      } else if (moneyCurr <= 10000) {
        ns.printf("Reached min. money threshold (%d) on %s. Beginning growth...", moneyCurr, server);
        growSrv(ns, server);
      } else {
        await ns.hack(server);
      }
    }
  
  
  
  }
  
  // Weaken till hack chance is > 95%
  async function weakenSrv(ns, server) {
    var hack_chance;
  
    while (true) {
      if (hack_chance <= 0.95) {
        await ns.weaken(server);
        hack_chance = ns.hackAnalyzeChance(server);
      } else {
        break;
      }
    }
    ns.print("Reached max. hack-chance threshold.");
  }
  
  // Grow money till max
  async function growSrv(ns, server) {
    var moneyCurr = ns.getServerMoneyAvailable(server);
    var moneyMax = ns.getServerMaxMoney(server);
  
    while (true) {
      if (moneyCurr < moneyMax) {
        moneyCurr *= await ns.grow(server);
      } else {
        break;
      }
    }
    ns.print("Reached max money on server.")
  }