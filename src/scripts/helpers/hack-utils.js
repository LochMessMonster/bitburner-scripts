const LINE_BREAK = "\n"
const home = "home"

/** @param {import("../").NS } ns */
/** @param {NS} ns */
export function loadServerFile(ns, filepath) {
  if (!ns.fileExists(filepath)) {
    // read and seperate each line into array
    let fileBuffer = ns.read(filepath);
    let list = fileBuffer.trim().split(LINE_BREAK);

    // remove items that aren't servers
    for (let i = 0; i < list.length; i++) {
      if (!ns.serverExists(list[i])) {
        list.splice(i, 1);
      }
    }
    return list;
  }
}
/** @param {NS} ns */
export function saveServerFile(ns, serverArray, filepath) {
  // delete file if exists
  if (ns.fileExists(filepath)) {
    ns.rm(filepath);
  }

  // output
  serverArray.forEach(async (srv) => {
    ns.write(filepath, srv + LINE_BREAK, "a");
  });
}

/** @param {import("../").NS } ns */
export function uploadScripts(ns, server, filepath) {
  ns.scp(filepath, server, home)
}