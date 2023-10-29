import { NS } from "@ns";

import * as Defaults from "scripts/utils/defaults"

// Merge this with below?
export async function main(ns: NS): Promise<void> {
    let path = <string> ns.args[0] ?? "";
    ns.tprintf("Deleted: " + remove(ns, path));
}

/**
 * Delete file or directory from current machine. Uses starting path 
 * (e.g. `a/b/` or `a/b.txt`) to filter. Does not support wildcards.
 * @param ns NS API
 * @param path Path of file/directory from where to start deleting. Can't be empty. 
 * @returns True if it successfully deletes, and false otherwise.
 */
function remove(ns:NS, path: string) : boolean {
    let fileList = ns.ls(ns.getHostname()).filter(file => file.startsWith(path));

    // If no files found or filepath is empty
    if ((fileList.length < 1) || (path === "")) { return false; }

    for (const file of fileList) {
        ns.tprintf("Deleting %s", file);
        let isDeleted = ns.rm(file);
        if (!isDeleted) { return false;}
    }
    return true;
}