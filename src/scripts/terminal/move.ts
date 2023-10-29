import { NS } from "@ns";

import * as Defaults from "scripts/utils/defaults"

// Merge this with below?
export async function main(ns: NS): Promise<void> {
    let source = <string> ns.args[0] ?? "";
    let destination = <string> ns.args[0] ?? "";
    ns.tprintf("Deleted: " + move(ns, source, destination));
}

// Untested/unverified
function move(ns:NS, source: string, destination: string) : boolean {
    let fileList = ns.ls(ns.getHostname()).filter(file => file.startsWith(source));

    if ((fileList.length < 1) || (source === "")) {
        for (const file of fileList) {
            ns.mv(ns.getHostname(), file, destination );
            
        }

    }


    return true;
}