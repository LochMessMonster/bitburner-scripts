
let scriptHack = "scripts/hack/hack-server.js";
let targetFilePath = "servers/nuked.txt";

/** @param {NS} ns */
export async function main(ns) {
  // use args if passed in
  if (ns.args.length === 2) {
      scriptHack = ns.args[0];
      targetFilePath = ns.args[1];
  }
  
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