import { NS } from "@ns";
import { Stack, Contract } from "scripts/utils/classes";
import { storeContract } from "scripts/utils/contract-utils";
import * as Defaults from "scripts/utils/defaults"

const extension = ".cct"

/**
 * Finds coding contracts across all servers and stores
 * them in Default specified directory.
 * Uses a depth-first approach.
 * @param ns NS API
 */
export async function finder(ns: NS): Promise<void> {
    
    let visitedServers = [Defaults.home]; 
    let foundContracts : Contract[] = [];

    // Scan servers from home
    let stack = new Stack();
    ns.scan(Defaults.home).forEach(srv => stack.push(srv));

    while (!stack.isEmtpy()) {
        let server:string = <string> stack.pop();

        visitedServers.push(server);
        // scan for all neighbours and add to stack if not visited
        ns.scan(server).forEach(srv => {
            if (!visitedServers.includes(srv)) {
                stack.push(srv);
            }
        })

        // Filter file list for contracts and store them
        let contractList = ns.ls(server).filter(file => file.endsWith(extension));

        for (const file of contractList) {
            let contract : Contract = {
                filename: file.toString(),
                server: server,
                solved: false
            }
            foundContracts.push(contract);
        }
    }

    // Output contract list
    storeContract(ns, foundContracts, Defaults.filepathContracts);
}
