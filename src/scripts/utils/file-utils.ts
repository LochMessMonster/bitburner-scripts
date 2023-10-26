import { NS } from "@ns";

// const csvExtension  = ".csv.txt";

const LINE_BREAK = "\n";

// Untested
export function loadFile(ns:NS, filepath: string): string[] {
    let fileContent: string[] = [];

    if (filepath !== "") {
        let fileBuffer = ns.read(filepath);

        fileContent =  fileBuffer.split(LINE_BREAK);
        fileContent.forEach(line => line.trim());
    }

    return fileContent;
}