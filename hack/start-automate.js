/** @param {NS} ns */
export async function main(ns) {
    const targetFilePath = "servers/nuked.txt";
  
    // const targetList = ["hong-fang-tea", "foodnstuff", "sigma-cosmetics", "joesguns", "iron-gym", "harakiri-sushi", "phantasy", "n00dles"];
    const targetList = getTargetList(ns, targetFilePath);
    const hostList = ns.getPurchasedServers().concat(targetList);
  
  
    const hackScript = "hack-server-v2.js";
    const defaultThreads = 1; // change to auto-determine?
  
    const hackScriptRam = ns.getScriptRam(hackScript);
    let serverRamMax, numOfScriptsToRun;
  
    // Loop through servers starting hack-server script for each srvr.
    for (let i = 0; i < hostList.length; i++) {
      serverRamMax = ns.getServerMaxRam(hostList[i]);
  
      // number of scripts the server can run
      numOfScriptsToRun = Math.floor(serverRamMax / hackScriptRam)
      ns.tprintf("Server '%s' can run: %d", hostList[i], numOfScriptsToRun);
  
      // if server can't run script, move to next
      if (numOfScriptsToRun <= 0) {
        continue;
      } else if (numOfScriptsToRun > targetList.length) {
        // if num exceeds list of servers, use server count instead
        numOfScriptsToRun = targetList.length;
        ns.tprintf("Server '%s' set to run: %d", hostList[i], numOfScriptsToRun);
      }
  
      // Upload hack script if not on server
      if (!ns.fileExists(hackScript, hostList[i])) {
        ns.scp(hackScript, hostList[i]);
      }
  
      // start as many hack script as possible
      for (let j = 0; j < numOfScriptsToRun; j++) {
        ns.exec(hackScript, hostList[i], defaultThreads, targetList[j]);
      }
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