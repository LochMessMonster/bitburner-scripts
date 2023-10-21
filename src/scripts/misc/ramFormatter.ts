import { NS } from "@ns";


/**
 * Prints a table with of RAM values and their formatted representation. Goes up-to hard-coded max ram (2^20).
 * @param ns NS API
 */
export async function main(ns: NS): Promise<void> {

    let ram = 2;
    let ramMax = Math.pow(ram, 20);

    const cyan = "\u001b[36m";
    const reset = "\u001b[0m";

    ns.tprintf(`${cyan}| %15s | %15s |${reset}`, "---------------", "---------------");
    ns.tprintf(`${cyan}| %15s | %15s |${reset}`, "Full", "Formatted");
    ns.tprintf(`${cyan}| %15s | %15s |${reset}`, "---------------", "---------------");
    while (ram <= ramMax) {
        ns.tprintf(`${cyan}| %15s | %15s |${reset}`, ram, ns.formatRam(ram));
        ram *= 2;
    }
    ns.tprintf(`${cyan}| %15s | %15s |${reset}`, "---------------", "---------------");
}