import { NS } from "@ns";

import * as Defaults from "scripts/utils/defaults"
import { uploadScripts } from "/scripts/utils/hack-utils";

export async function main(ns: NS): Promise<void> {
    const script = Defaults.scriptXP;
    
    // Get hosts within home range that are rooted
    let hostList = ns.scan(Defaults.home).filter(srv => ns.hasRootAccess(srv));


    // Add home and p-servs to hosts
    hostList.concat(Defaults.home);
    hostList.concat(ns.getPurchasedServers());

    let target = Defaults.xpFarmTargets[0];

    for (let i = 0; i < hostList.length; i++) {
        let host = hostList[i];      
        if (i == Math.floor(hostList.length/2)) {
            target = Defaults.xpFarmTargets[1];
        }

        let threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(script))


        uploadScripts(ns, host, script);

        ns.exec(script, host, threads, target);
    }
}
