import { HackThresholds } from "scripts/utils/classes";

// home server
export const home               = "home";
export const homeMaxRam         = 8192;     // 16 TB - increase later

// reserve level of X that scripts will leave
export const reserveMoney       = 250000;   // 800k
export const reserveRam         = 64;       // 16 gb

// purchased server defaults
export const psrvPrefix         = "psrv-";
export const psrvRamMin         = 8;        // 8 GB
export const psrvMaxMax         = 256; // 16384;    // 16 TB - increase later

// hacknet
export const hacknetNodeLimit   = 3;
export const hacknetLevelLimit  = 20;
export const hacknetRamLimit    = 2;
export const hacknetCoreLimit   = 1;

export const xpFarmTargets      = ["n00dles", "foodnstuff"]
export const xpThreshold        = 50;

// server list filepaths
export const filepathTarget     = "servers/nuked.txt"
export const filepathFailed     = "servers/failed.txt"
export const filepathBlacklist  = "servers/blacklist.txt"

// script name
// export const scriptsHGW : Script[] = [
//     { name: "Hack", filepath: "scripts/hack/hgw-hack.js"},
//     { name: "Grow", filepath: "scripts/hack/hgw-grow.js"},
//     { name: "Weaken", filepath: "scripts/hack/hgw-weaken.js"}
// ]

// HGW
export const scriptHack         = "scripts/hack/hgw-hack.js"
export const scriptGrow         = "scripts/hack/hgw-grow.js"
export const scriptWeaken       = "scripts/hack/hgw-weaken.js"

// XP
export const scriptXP           = "scripts/xp/xp.js"
export const scriptXPFarm       = "scripts/xp/xpFarm.js"

// Hacking
export const scriptSpider       = "scripts/hack/spider.js"
export const scriptStart        = "scripts/hack/start-automate.js"
export const scriptStop         = "scripts/hack/stop-automate.js"

// Shopping
export const scriptHacknet      = "scripts/shop/hacknet.js"
export const scriptServerRack   = "scripts/shop/server-rack.js"

// Managers
export const scriptManager      = "scripts/manager.js"

export const serverHackThreshold : HackThresholds[] = [
    {server: "joesguns", threshold: 200},
    {server: "phantasy", threshold: 1000},
    {server: "rho-construction", threshold: 2500}
]
