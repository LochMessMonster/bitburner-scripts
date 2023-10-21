import { NS } from "@ns";
import { Port } from  "scripts/utils/classes";

const LINE_BREAK = "\n"

export function uploadScripts(ns: NS, server:string, scripts: string | string[]) {
    ns.disableLog('scp');
    ns.scp(scripts, server, "home");
}

/**
 * Load list of servers from specified file
 * @param ns NS API
 * @param filepath Filepath/name to read server file (eg - foo/bar.txt)
 * @returns string[] Array of servers from file
 */
export function loadServerFile(ns : NS, filepath : string) : string[] {
    let list : string[] = [];

    if (ns.fileExists(filepath)) {
      // read and seperate each line into array
      let fileBuffer = ns.read(filepath);
      list = fileBuffer.trim().split(LINE_BREAK);
  
      // remove items that aren't servers -- could save ram by removing check
      for (let i = 0; i < list.length; i++) {
        if (!ns.serverExists(list[i])) {
          list.splice(i, 1);
        }
      }
    }
    return list;
}

/**
 * Save list of servers to specified filepath
 * @param ns NS API
 * @param serverArray List of servers
 * @param filepath Filepath/name to save the list (e.g - foo/bar.txt)
 */
export function saveServerFile(ns: NS, serverArray: string[], filepath: string) {
  // delete file if exists
  if (ns.fileExists(filepath)) {
    ns.rm(filepath);
  }

  // output
  serverArray.forEach(async (srv) => {
    ns.write(filepath, srv + LINE_BREAK, "a");
  });
}

/**
 * Prepare list of ports that can be cracked. Includes a short-hand name,
 * the program it uses, and the ns API call needed to run programmatically.
 * @param ns NS API
 * @returns Array of ports that are available to crack.
 */
export function getAvailablePorts(ns:NS) : Array<Port> {
  let portList : Array<Port> = [
    {"name": "ssh", "program": "BruteSSH.exe", "run": ns.brutessh},
    {"name": "ftp", "program": "FTPCrack.exe", "run": ns.ftpcrack},
    {"name": "smtp", "program": "relaySMTP.exe", "run": ns.relaysmtp},
    {"name": "http", "program": "HTTPWorm.exe", "run": ns.httpworm},
    {"name": "sql", "program": "SQLInject.exe", "run": ns.sqlinject}
  ]
  
  // Filter available scripts
  let availablePorts : Array<Port> = [];
  portList.forEach(port => {
    if (ns.fileExists(port.program)) {
      availablePorts.push(port);
    }
  });
  return availablePorts;
}