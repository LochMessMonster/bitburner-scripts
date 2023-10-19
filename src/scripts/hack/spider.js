/**
 * Crawls through the web nuking servers and adding outputting list.
 * - Uses BFS approach
 */

import { loadServerFile, saveServerFile, getPortScripts } from "scripts/helpers/hack-utils.js"
import { Queue } from "scripts/helpers/classes.js"

const home              = "home";
const filepathTarget    = "servers/nuked.txt"
const filepathFailed    = "servers/failed.txt"
const filepathBlacklist = "servers/blacklist.txt"

/** @param {NS} ns */
export async function main(ns) {
  // define how far to go. default 50
  let nodeCount = 0, nodeLimit = 50; 
  if (ns.args > 0) {
    nodeLimit = ns.args[0];
  }

  let failedServers = [];
  // add home/owned servers to blacklist
  let blacklist = ns.getPurchasedServers().concat([home]);
  // load target list to skip these nodes
  // let nukedServers = loadServerFile(ns, filepathTarget);
  let nukedServers = [];

  // get list of servers from home excluding purchased servers
  let serverQueue = new Queue();
  ns.scan(home).forEach((srv) => {
    if (!blacklist.includes(srv)) {
      serverQueue.enqueue(srv);
    }
  });

  // While has servers to crawl
  while (!serverQueue.isEmtpy()) {
    let currentServer = serverQueue.dequeue();

    // SCAN //
    // if at/below scan limit, scan servers
    if (nodeCount <= nodeLimit) {
      ns.scan(currentServer).forEach((srv) => {
        // if not already in queue or visited / nuked / blacklisted
        let isVisitedSrv = nukedServers.includes(srv) || failedServers.includes(srv) ||  blacklist.includes(srv);
        if (!serverQueue.contains(currentServer) && !isVisitedSrv) {
          serverQueue.enqueue(srv);
        }
      });
    }
    
    // check if visited / nuked / blacklisted
    let visited = nukedServers.includes(currentServer) || failedServers.includes(currentServer) || blacklist.includes(currentServer);
    if (visited) {
      continue;
    } else {
      nodeCount++;
    }

    // ENSLAVE //
    // if current server has no max money or ram, add to blacklist for investigation
    if ((ns.getServerMaxMoney(currentServer) <= 0) || (ns.getServerMaxRam(currentServer) <= 0)) {
      blacklist.push(currentServer);
      continue;
    }
    // if server is nuked but not tracked, add to list
    if (ns.hasRootAccess(currentServer)) {
      nukedServers.push(currentServer);
      continue;
    }

    // update tracking based on result
    let serverStatus = portHack(ns, currentServer);
    if (serverStatus) {
      nukedServers.push(currentServer);
    } else {
      failedServers.push(currentServer);
    }
  }

  saveServerFile(ns, nukedServers, filepathTarget);
  saveServerFile(ns, failedServers, filepathFailed);
  saveServerFile(ns, blacklist, filepathBlacklist);
}

/** @param {import(".").NS } ns */
/** @param {NS} ns */
function portHack(ns, server) {
  // Ports available to hack
  const portList = getPortScripts(ns);

  if (ns.serverExists(server)) {
    let numPorts = ns.getServerNumPortsRequired(server);

    // if hackable
    if (numPorts <= portList.length) {
      portList.forEach(port => {
        port.run(server);
      });
      //nukem
      ns.nuke(server);
      return true;
    }
  }
  return false;
}
