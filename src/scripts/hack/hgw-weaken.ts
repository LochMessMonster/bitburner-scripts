import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    if (ns.args.length > 0) {
        let server : string = <string> ns.args[0];

        await ns.weaken(server)
    }
}
