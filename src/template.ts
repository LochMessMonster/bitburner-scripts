import type { NS } from "../NetscriptDefinitions.d.ts"

export async function main(ns: NS): Promise<void> {
  ns.tprint("Hello Remote API!");
  ns.tprint(123);
  ns.tprint(ns.getHostname());
}
