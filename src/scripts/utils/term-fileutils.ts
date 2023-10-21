import { NS } from "@ns";


export async function main(ns: NS): Promise<void> {
    if (ns.args.length > 0) {
        let cmd : string = <string> ns.args[0];
        let filepath : string = <string> ns.args[0];

        switch (cmd) {
            case 'rm':
                rmdir(ns, ns.getHostname(), filepath);
                break;
        }

    }
}

function rmdir (ns : NS, server : string, filepath : string) : void {
    let dirList = ns.ls(server);

    ns.tprint("DIRLIST: " + dirList)

    if (dirList.length > 0) { 
        let hitList : string[] = [];

        dirList.forEach(file => {
            if (file.startsWith(filepath)) {
                ns.tprint(file)
                hitList.push(file);
            }
        });

        ns.tprint(hitList);
    } else {
        ns.tprint ("Filepath is empty");
    }
}
