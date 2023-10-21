import { NS } from "@ns";

// import * as Defaults from "../utils/defaults"
import * as Defaults from "scripts/utils/defaults"
import {uploadScripts, loadServerFile} from "scripts/utils/hack-utils"

export async function main(ns: NS): Promise<void> {
    // Server list of targets (target of scripts)
    let targetList = loadServerFile(ns, Defaults.filepathTarget);
    // Server list of hosts (runs the scripts)
    let hostList = ns.getPurchasedServers().concat(targetList);

    // Seperate check for home to kill auto- start script
    if (ns.scriptRunning(Defaults.scriptStart, Defaults.home)) {
        ns.scriptKill(Defaults.scriptStart, Defaults.home);
    }

    // If there are any hosts, kill all running scripts on them
    if (hostList.length > 0) {
        for (const host of hostList) {
            ns.killall(host, false);
        }
    }
}