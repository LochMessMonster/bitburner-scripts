import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    let target = "joesguns"
    if (ns.args.length > 0) {
        target = <string> ns.args[0];
    }

    while (ns.getHackingLevel() < 100) {
        // Grow or Weaken
        if (ns.getServerSecurityLevel(target) > ns.getServerBaseSecurityLevel(target)) {
            await ns.weaken(target);
        } else {
            await ns.grow(target)
        }
        
        // random chance of hacking cuz why not
        if (Math.random() > 0.50 && Math.random() < 0.57) {
            await ns.hack(target);
        }
    }
}
