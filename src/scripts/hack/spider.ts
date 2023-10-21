/**
 * Crawls through the web nuking servers and adding outputting list.
 * - Uses BFS approach
 */

import { NS } from "@ns";

import { Queue, Port } from "scripts/utils/classes"
import { getAvailablePorts, saveServerFile } from "scripts/utils/hack-utils"
import * as Defaults from "scripts/utils/defaults"
// import { Queue, Port } from "../utils/classes"
// import { getAvailablePorts, saveServerFile } from "../utils/hack-utils"
// import * as Defaults from "../utils/defaults"


export async function main(ns:NS) {
  // define how far to go. default 50
  let nodeCount = 0, nodeLimit = 50; 
  if (ns.args.length > 0) {
    nodeLimit = <number>ns.args[0];
  }

  let failedServers : string[]  = [];
  // add home/owned servers to blacklist
  let blacklist : string[]  = ns.getPurchasedServers().concat([Defaults.home]);
  // load target list to skip these nodes
  // let nukedServers = loadServerFile(ns, filepathTarget);
  let nukedServers : string[] = [];

  // get list of servers from home excluding purchased servers
  let serverQueue = new Queue();
  ns.scan(Defaults.home).forEach((srv) => {
    if (!blacklist.includes(srv)) {
      serverQueue.enqueue(srv);
    }
  });

  // While has servers to crawl
  while (!serverQueue.isEmtpy()) {
    let currentServer = <string>serverQueue.dequeue();

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

  saveServerFile(ns, nukedServers, Defaults.filepathTarget);
  saveServerFile(ns, failedServers, Defaults.filepathFailed);
  saveServerFile(ns, blacklist, Defaults.filepathBlacklist);
}


function portHack(ns:NS, server: string) {
  // Ports available to hack
  const portList = getAvailablePorts(ns);

  if (ns.serverExists(server)) {
    let numPorts = ns.getServerNumPortsRequired(server);

    // if hackable
    if (numPorts <= portList.length) {
        try {
            portList.forEach((port: Port) => {
                port.run(server);
                // let method : { (host: string): void; } = port.run;
                // method(server);
            });
    
            ns.nuke(server);
            return true
    
        } catch (error) {
            ns.print("ERROR " + error);
            return false;
        }
    }
  }
  return false;
}