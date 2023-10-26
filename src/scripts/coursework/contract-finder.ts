import { NS } from "@ns";
import { Stack, Contract } from "scripts/utils/classes";
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
    storeContract(ns, foundContracts);
}

/**
 * Store the provided list of contracts to location specified 
 * in Defaults. File is stored in CSV format (`.csv.txt`). 
 * @param ns NS API
 * @param contractList Array of contracts
 */
function storeContract(ns:NS, contractList: Contract[]) {
    if (ns.fileExists(Defaults.filepathContracts)) {
        ns.rm(Defaults.filepathContracts);
    }

    ns.print("Found %d contracts. Saving to %s", contractList.length, Defaults.filepathContracts);

    for (const contract of contractList) {
        ns.write(Defaults.filepathContracts, prepareString(contract), "a" );
    }
}

/**
 * Returns tring representation of Contract in CSV format.
 * Planned to implement toString method to simplify this.
 * @param contract Contract object
 * @returns String representation of contract in CSV.
 */
function prepareString (contract: Contract) : string {
    let prepare = "";
    prepare += contract.filename    + ", ";
    prepare += contract.server      + ", ";
    prepare += contract.solved      + "\n";
    return prepare;
}
