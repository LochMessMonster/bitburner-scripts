
/** @param {import("../").NS } ns */
export function loadServerFile(ns, filepath) {
  // read and seperate each line into array
  let fileBuffer = ns.read(filepath);
  let list = fileBuffer.trim().split("\n");

  // remove items that aren't servers
  for (let i = 0; i < list.length; i++) {
    if (!ns.serverExists(list[i])) {
      list.splice(i, 1);
    }
  }
  return list;
}