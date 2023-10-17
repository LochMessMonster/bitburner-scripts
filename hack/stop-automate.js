/** @param {NS} ns */
export async function main(ns) {
    const targetFilePath = "servers/nuked.txt";
  
    // const targetList = ["hong-fang-tea", "foodnstuff", "sigma-cosmetics", "joesguns", "iron-gym", "harakiri-sushi", "phantasy", "n00dles"];
    const targetList = getTargetList(ns, targetFilePath);
    const hackScript = "hack-server-v2.js";
  
    let serverList = ns.getPurchasedServers().concat(targetList);
  
    for (let i = 0; i < serverList.length; i++) {
      // ns.tprint("Stopping: " + serverList[i]);
      ns.scriptKill(hackScript, serverList[i]);
    }
  }
  
  /** @param {NS} ns */
  function getTargetList(ns, filepath) {
    let fileContent = ns.read(filepath);
    let list = fileContent.trim().split("\n");
  
    // remove items that aren't servers
    for (let i = 0; i < list.length; i++) {
      if (!ns.serverExists(list[i])) {
        list.splice(i, 1);
      }
    }
    return list;
  }