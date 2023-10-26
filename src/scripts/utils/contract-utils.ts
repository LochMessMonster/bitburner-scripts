import { NS } from "@ns";
import * as Defaults from "scripts/utils/defaults";
import { loadFile } from "scripts/utils/file-utils";
import { Contract } from "scripts/utils/classes"

export function loadContracts(ns:NS, filepath: string | undefined = Defaults.filepathContracts) : Array<Contract> {
    const contractList : Array<Contract> = [];

    let fileContent = loadFile(ns, filepath);

    if (fileContent.length > 0) {
        
        for (const row of fileContent) {
            let rowData = row.split(",");

            let contract : Contract = {
                filename  :  rowData[0],
                server    :  rowData[1],
                solved    :  (rowData[2] === "true")
            }
            contractList.push(contract);
        }
    }

    return contractList;
}


/**
 * Store the provided list of contracts to location specified 
 * in Defaults. File is stored in CSV format (`.csv.txt`). 
 * @param ns NS API
 * @param contractList Array of contracts
 * @param path (Optional) Filepath of where to store contract
 */
export function storeContract(ns:NS, contractList: Contract[], path: string | undefined ) {
    const filepath = path ?? Defaults.filepathContracts;

    if (ns.fileExists(filepath)) {
        ns.rm(filepath);
    }

    ns.print("Storing %d contracts to %s", contractList.length, filepath);

    for (const contract of contractList) {
        ns.write(filepath, prepareContractString(contract), "a" );
    }
}

/**
 * Returns tring representation of Contract in CSV format.
 * Planned to implement toString method to simplify this.
 * @param contract Contract object
 * @returns String representation of contract in CSV.
 */
export function prepareContractString (contract: Contract) : string {
    let prepare = "";
    prepare += contract.filename    + ",";
    prepare += contract.server      + ",";
    prepare += contract.solved      + "\n";
    return prepare;
}