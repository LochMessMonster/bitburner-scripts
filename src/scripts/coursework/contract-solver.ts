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

function solve(contractType: string, inputData: any) : any {
    let result;
    switch(contractType) {
        case "Array Jumping Game":
            result = arrayJump(inputData);
            break;
        case "Compression I: RLE Compression":
            result = rteCompression(inputData);
            break;
    }

    return result;
}

// --------------- Contract solutions --------------- //

// Compression : Run-Time Encoding
function rteCompression(inputData: string) : string {
    let arr = inputData.toString().trim().split("");
    let encoding = "";
    let charCount = 0, charCurrent = arr[0];

    for (const char of arr) {
        // If diff char or hit limit of 9
        if ((charCurrent !== char) || (charCount == 9)) {
            encoding += charCount.toString() + charCurrent;
            
            charCurrent = char;
            charCount = 1;
        } else {
            charCount += 1;
        }
    }
    // Add final 
    encoding += charCount.toString() + charCurrent;

    return encoding;
}


// UNTESTED - Might be wrong
function arrayJump(inputData: number[]) : number {
    let len = inputData.length;
    let jump = inputData[0];

    if (inputData.length < 1) { return 0; }

    for (let i = 1; i < len; i++) {
        if (jump == 0) { return 0; }
        jump = Math.max( jump - 1, inputData[i] );
    }
    return 1;
}