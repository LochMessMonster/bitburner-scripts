import { loadServerFile } from "scripts/helpers/hack-utils.js"

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
    const targetList = loadServerFile(ns, targetFilePath);
    
    let serverList = ns.getPurchasedServers().concat(targetList);
  
    for (let i = 0; i < serverList.length; i++) {
      // ns.tprint("Stopping: " + serverList[i]);
      ns.scriptKill(scriptHack, serverList[i]);
    }
  }