import { NS } from "@ns";

import * as Defaults from "scripts/utils/defaults"

const commands = ["remove", "copy", "move"];


// WIP
export async function main(ns: NS): Promise<void> {
    if (ns.args.length < 3) {
        ns.tprint("Error");
        ns.exit();
    } 

    //experiment with flags
    let cmd : string= <string> ns.args.at(0) ?? "";
    let pathSource : string = <string> ns.args.at(1) ?? "";
    let pathDest : string = <string> ns.args.at(2) ?? "";

    if (cmd == "" || pathSource == "" || pathDest == "" || !commands.includes(cmd) ) {
        ns.tprint("Error");
        ns.exit();
    }
}
