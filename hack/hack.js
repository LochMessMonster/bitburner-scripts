export async function main(ns, threads = ns.args[0], target = ns.args[1]) {
	await ns.hack(target, { threads });
}