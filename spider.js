/**
 * Crawls through the web nuking servers and adding outputting list.
 * - Uses BFS approach
 */

/** @param {NS} ns */
export async function main(ns) {
  const home = "home";
  let blacklist = ns.getPurchasedServers().concat([home]);
  let nukedServers = [], failedServers = [];

  // define how far to go. default 10
  let nodeCount = 0, nodeLimit = 20;
  
  if (ns.args > 0) {
    nodeLimit = ns.args[0];
  }

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

    // check if visited / nuked / blacklisted
    let visited = nukedServers.includes(currentServer) || failedServers.includes(currentServer) || blacklist.includes(currentServer);
    if (visited) {
      continue;
    } else {
      nodeCount++;
    }

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

    // ENSLAVE //
    // if current server has no max money, add to blacklist for investigation
    if (ns.getServerMaxMoney(currentServer) <= 0.0) {
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

  outputt(ns, nukedServers, "nuked");
  outputt(ns, failedServers, "failed");
  outputt(ns, blacklist, "blacklist");
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


/** @param {NS} ns */
async function outputt(ns, serverArr, filename) {
  let filepath = "servers/" + filename + ".txt";

  // delete file if exist
  if (ns.fileExists(filepath)) {
    ns.rm(filepath);
  }
  // output
  serverArr.forEach(async (srv) => {
    await ns.write(filepath, srv + "\n", "a");
  });
}

/** @param {NS} ns */
async function getPortScripts(ns) {
  let portScripts = {
    "BruteSSH.exe" : {port: "ssh", run: ns.brutessh},
    "FTPCrack.exe" : {port: "ftp", run: ns.ftpcrack},
    "relaySMTP.exe" :{port:  "smtp", run: ns.relaysmtp},
    "HTTPWorm.exe" : {port: "http", run: ns.httpworm},
    "SQLInject.exe" : {port: "sql", run: ns.sqlinject},
  }
  
  // Filter available scripts
  let availableScripts = [];
  Object.keys(portScripts).forEach(script => {
    if (ns.fileExists(script, "home")) {
      availableScripts.push(portScripts[script]);
    }
  });
  return availableScripts;
}

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    return this.items.push(item);
  }

  // O(n) complexity find smth better
  dequeue() {
    return this.items.shift();
  }

  peekq() {
    return this.items[0];
  }

  contains(item) {
    return this.items.includes(item);
  }

  isEmtpy() {
    return (this.items.length == 0);
  }

  get length() {
    return this.items.length;
  }
}