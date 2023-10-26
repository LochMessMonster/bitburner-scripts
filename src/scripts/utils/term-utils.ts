import { NS } from "@ns";

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

function xargs (ns:NS, sourceScript:string, sourceScriptArgs: string[], destScript: string) {
    if (!ns.fileExists(sourceScript) || !ns.fileExists(destScript)) {
        ns.print("ERROR - Either source or destination script don't exist.");
    }



}




function copy(ns:NS, source:string, destination: string) {
    






}