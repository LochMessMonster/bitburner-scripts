/** 
 * @param {NS} ns 
 * @param {server} target-server
 */
export async function main(ns) {
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
  
    // min/max thresholds for server money
    const moneyMin = ns.getServerMaxMoney(server) * 0.40;
    // const moneyMax = ns.getServerMaxMoney(server) * 0.80;
    // hack thresholds for server security level
    // const hackMin = ns.getServerMinSecurityLevel(server);
    const hackMax = 85;
  
    var hackCurr, moneyCurr;
    while (true) {
      hackCurr = ns.getServerSecurityLevel(server);
      moneyCurr = ns.getServerMoneyAvailable(server);
  
      if (moneyCurr <= moneyMin) {
        await ns.grow(server)
      } else if (hackCurr > hackMax) {
        await ns.weaken(server)
      } else {
        await ns.hack(server);
      }
    }
  }