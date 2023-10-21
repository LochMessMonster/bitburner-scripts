import { NS } from "@ns";

import {uploadScripts} from "scripts/utils/hack-utils"

const secLevelThresh = 85;
const minThreads = 1;

const scriptHack = "scripts/hack/hgw-hack.js";
const scriptGrow = "scripts/hack/hgw-grow.js";
const scriptWeaken = "scripts/hack/hgw-weaken.js";

export async function main(ns: NS): Promise<void> {
    if (ns.args.length > 0) {
        let server : string = <string> ns.args[0];
        let threads = minThreads; // <number> ns.args[1];

        uploadScripts(ns, server, [scriptGrow, scriptWeaken, scriptHack])

        let srvMoneyThresh = ns.getServerMaxMoney(server) * 0.7;
        let secLevelThresh = ns.getServerMinSecurityLevel(server) + 10;

        let i = 0, passes = 10;

        while (i <= passes) {
            i ++;
            if (ns.getServerMoneyAvailable(server) < srvMoneyThresh) {
                ns.exec(scriptGrow, server, 1, server);
            } else if (ns.getServerSecurityLevel(server) < secLevelThresh) {
                ns.exec(scriptWeaken, server, threads, server);
            } else {
                ns.exec(scriptHack, server, threads, server)
            }
            await ns.sleep(10000);
        }
    }
}
