import { NS } from "@ns";
import { loadContracts, storeContract } from "scripts/utils/contract-utils";
import * as Defaults from "scripts/utils/defaults"

const contractScriptPath = "scripts/coursework"

// UNTESTED
/**
 * Solves contracts if script is available
 * @param ns NS API
 */
export async function solver(ns: NS): Promise<void> {
    let contractList = loadContracts(ns, Defaults.filepathContracts);

    for (const contract of contractList) {
        if (contract.solved) { continue; }

        let file = contract.filename.split(".")[0];

        let contractScript = contractScriptPath + file + ".js";
        if (ns.fileExists(contractScript)) {
            let data = ns.codingcontract.getData(contract.filename, contract.server);
            let tries = ns.codingcontract.getNumTriesRemaining(contract.filename, contract.server);

            // Check how many parts data is in
            // Check tries > 1
            
            // NS.run doesn't return output. So move attempt method into script?
            // let output = ns.run()
            let solution = ns.run(contractScript, 1, data);
            let reward = ns.codingcontract.attempt(solution,contract.filename,contract.server);

            if (reward) {
                ns.print(reward);
                contract.solved = true;
            } else {
                ns.tprintf("Coding contract %s failed. Tries remaining: ", contract.filename, tries);
            }
        }
    }

    storeContract(ns, contractList, Defaults.filepathContracts);
}