import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    if (ns.args.length !== 1) {
        ns.tprint("1 args - input string");
    }

    const input = ns.args[0];
    let inputArr = input.toString().trim().split("")
    
    ns.tprint(inputArr);

    let encoding = "";
    let charCurrent = "";
    let charCount = 0;
    for (const char of inputArr) {
        // Current char is empty, set tracker
        if (charCurrent === "") {
            charCurrent = char;
            charCount = 1;
            continue;
        }

        // If different char or hit limit of 9 chars
        if ((charCurrent !== char) || (charCount == 9)) {
            // update encoded string
            encoding += charCount.toString() + charCurrent;

            // Move tracker to next char
            charCurrent = char;
            charCount = 1;

        } else {
            // is same char, update count
            charCount += 1; 
        }
    }
    // Add final chars
    encoding += charCount.toString() + charCurrent;


    ns.tprint(encoding);
}

