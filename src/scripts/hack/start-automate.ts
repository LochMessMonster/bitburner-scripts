import { NS } from "@ns";


// import * as Defaults from "../utils/defaults"
import * as Defaults from "scripts/utils/defaults"
import {uploadScripts, loadServerFile} from "scripts/utils/hack-utils"

// Because typescript is a Karen who can't fucking deal with Objects
let scriptsHGW = [Defaults.scriptGrow, Defaults.scriptHack, Defaults.scriptWeaken]

export async function main(ns: NS): Promise<void> {
  // Get list of nuked servers
  let nukedServers = loadServerFile(ns, Defaults.filepathTarget);
  // Server list of hosts (runs the scripts)
  let hostList = prepareServerHostList(ns, ns.getPurchasedServers().concat(nukedServers));
  // Server list of targets (target of scripts)
  let targetList = prepareServerTargetList(ns, nukedServers);

  let time = 0;

  for (let i = 0, j = 0; i < hostList.length && j < targetList.length; i++, j++) {
    let host = hostList[i];
    let target = targetList[j];

    // Upload HGW scripts to host
    uploadScripts(ns, host, scriptsHGW);

    // host data 
    let ramMax = ns.getServerMaxRam(host);
    let ramUsed = ns.getServerUsedRam(host);

    // target data
    let moneyCurr = ns.getServerMoneyAvailable(target); 
    let moneyThresh = ns.getServerMaxMoney(target) * 0.9;
    let secCurr = ns.getServerSecurityLevel(target);
    let secThresh = ns.getServerMinSecurityLevel(target) + 3;

    // determine action
    let action = "";
    if (moneyCurr < moneyThresh) {
      action = "Grow";
    } else if (secCurr > secThresh) {
      action = "Weaken";
    } else {
      action = "Hack";
    }


    // Get script / action time
    let script : string = "";
    let actionTime : number = 0;
    // probably a better way to do this but fuck TS
    switch (action) {
      case "Hack":
        script = Defaults.scriptHack; actionTime = ns.getHackTime(target); break;
      case "Grow":
        script = Defaults.scriptGrow; actionTime = ns.getGrowTime(target); break;
      case "Weaken":
        script = Defaults.scriptWeaken; actionTime = ns.getWeakenTime(target); break;
    }

    if (script == "") { ns.tprint("script be empty. js fuckjed up again what a suprise") }
    let scriptRam = ns.getScriptRam(script);
    
    let threadsAvailable = Math.floor((ramMax - ramUsed) /  scriptRam);
    if (threadsAvailable === 0) continue;


    // Set time to the longest of script times
    time = Math.max(time, actionTime);


    let pid = ns.exec(script, host, threadsAvailable, target);
    if (pid === 0) continue;
  }
  
  time += 60000; // add on 1 min margin
  // ns.printf("Sleeping for %d mins, %d sec", (time/1000)/60, (time/1000) )
  // await ns.sleep(time);
}

/**
 * Sort list of target servers by maximum money on servers and remove any servers
 * that are beyond hacking threshold (hacking level/2).
 * @param ns NS API
 * @param serverArray Server list
 * @returns string[] of target servers sorted by money and can be reasonably hacked
 */
function prepareServerTargetList(ns: NS, serverArray: string[]) : string[] {
  const playerHackingThreshold = Math.ceil(ns.getHackingLevel() / 2);

  // Filter for list of servers that are within hacking threshold
  let hackableServersList = serverArray.filter((srv) => {
    return ns.getServerRequiredHackingLevel(srv) <= playerHackingThreshold
  });
  
  // Return list sorted by max money
  return rankServerByMaxMoney(ns, hackableServersList);
}

/**
 * Sort list of host servers by maximum RAM and remove servers that 
 * have active scripts. Only keeps idling servers in the list.
 * @param ns NS API
 * @param serverArray Server list
 * @returns string[] of host servers sorted by ram and are idle
 */
function prepareServerHostList(ns:NS, serverArray: string[]) : string[] {
  // Filter for list of servers that are idling
  let idleServerList = serverArray.filter((srv) => {
    return  ns.getServerUsedRam(srv) == 0;
  });

  // Return list sorted by max ram
  return rankServerByMaxRam(ns, idleServerList);
}


/**
 * Sort list of server by Max RAM in descending order
 * @param ns 
 * @param serverArray 
 */
function rankServerByMaxRam(ns: NS, serverArray: string[]) : string[] {
  serverArray.sort((srvA, srvB) : number => {
    let ramA = ns.getServerMaxRam(srvA);
    let ramB = ns.getServerMaxRam(srvB);
      if (ramA > ramB) {
        return -1;  // sort A before B
      } else if (ramA < ramB) {
        return 1;   // sort A after B
      } else {
        return 0;   // leave as-is
      }
  })

  return serverArray;
}

/**
 * Sort list of server by Max Money in descending order
 * @param ns 
 * @param serverArray 
 */
function rankServerByMaxMoney(ns: NS, serverArray: string[]) : string[] {
    // Sort targetList by Server Money in descending
    serverArray.sort((srvA, srvB) => {
      let moneyA = ns.getServerMoneyAvailable(srvA);
      let moneyB = ns.getServerMoneyAvailable(srvB);
      if (moneyA > moneyB) {
        return -1;  // sort A before B
      } else if (moneyA < moneyB) {
        return 1;   // sort A after B
      } else {
        return 0;   // leave as-is
      }
    })
  return serverArray;
}


// Archive 
// for (let host of hostList) {
//   let ramMax = ns.getServerMaxRam(host);
//   let ramUsed = ns.getServerUsedRam(host);

//   let threadsAvailable = Math.floor((ramMax - ramUsed) /  scriptRamA);
//   if (threadsAvailable === 0) continue;

//   let script = ""
//   let t = "t"

// function getThreads(ns : NS, server:string, action:string) {
//     const moneyThresh = ns.getServerMaxMoney(server) * 0.7;
//     const secThresh = ns.getServerMinSecurityLevel(server) + 10;
//     let moneyCurr = ns.getServerMoneyAvailable(server);

//     let threads = 0;

//     switch (action.toLowerCase()){
//         case "g" || "grow":
//             if (moneyCurr < 1) {
//                 threads = 1;
//             } else {
//                 let growMult = moneyThresh / moneyCurr;
//                 threads = (growMult >= 1) ? Math.round(ns.growthAnalyze(server, growMult)) : 1;
//             }
//             break;

//         case "w" || "weaken":
//             let weaken = ns.weakenAnalyze(1);
//             // let secDiff = Math.abs()


//     }
// }


//   let ramUsable = Math.floor((ramMax - ramUsed ) / scriptRamA) * scriptRamA;

//   // skip host if can't run scripts
//   if (ramUsable < scriptRamA) continue;

//   // Run step to kill all scripts before this

//   // Upload scripts to host
//   uploadScripts(ns, host, scriptsHGW);


//   ns.getGrowTime()
// }

// // Loop through servers starting hack-server script for each srvr.
// for (let i = 0; i < hostList.length; i++) {
//     let host = hostList[i];
//     let hostMaxRam = ns.getServerMaxRam(host);

//     // number of scripts the server can run
//     numOfScriptsToRun = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / scriptRam["Hack"]);
//     ns.printf("Server '%s' can run: %d", host, numOfScriptsToRun);

//     // if server can't run script, move to next
//     if (numOfScriptsToRun <= 0) {
//       continue;
//     } else if (numOfScriptsToRun > targetList.length) {
//       // if num exceeds list of servers, use server count instead
//       numOfScriptsToRun = targetList.length;
//       ns.printf("Server '%s' set to run: %d", host, numOfScriptsToRun);
//     }

//     // Upload scripts to host
//     uploadScripts(ns, host, scriptsHGW);

//     // start as many hack script as possible
//     for (let j = 0; j < numOfScriptsToRun; j++) {
//       ns.exec(Defaults.scriptHack, host, defaultThreads, targetList[j]);
//     }
