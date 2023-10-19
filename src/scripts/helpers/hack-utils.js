const LINE_BREAK = "\n"
const home = "home"

/** @param {import("../").NS } ns */
/** @param {NS} ns */
export function loadServerFile(ns, filepath) {
  if (!ns.fileExists(filepath)) {
    // read and seperate each line into array
    let fileBuffer = ns.read(filepath);
    let list = fileBuffer.trim().split(LINE_BREAK);

    // remove items that aren't servers
    for (let i = 0; i < list.length; i++) {
      if (!ns.serverExists(list[i])) {
        list.splice(i, 1);
      }
    }
    return list;
  }
}
/** @param {NS} ns */
export function saveServerFile(ns, serverArray, filepath) {
  // delete file if exists
  if (ns.fileExists(filepath)) {
    ns.rm(filepath);
  }

  // output
  serverArray.forEach(async (srv) => {
    ns.write(filepath, srv + LINE_BREAK, "a");
  });
}

/** @param {import("../").NS } ns */
export function uploadScripts(ns, server, filepath) {
  ns.scp(filepath, server, home);
}

/** @param {NS} ns */
export async function getPortScripts(ns) {
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