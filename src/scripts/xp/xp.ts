import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    if (ns.args.length > 0) {
        let target: string = <string>ns.args[0];

        const minSec = ns.getServerMinSecurityLevel(target) + 10;
        // const maxMoney = ns.getServerMaxMoney(target);


        while (true) {
            if (ns.getServerSecurityLevel(target) > minSec) {
                await ns.weaken(target);
            } else {
                await ns.hack(target);
            }
        }
    }
}
