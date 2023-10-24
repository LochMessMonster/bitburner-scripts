import { NS } from "@ns";

import * as Defaults from "scripts/utils/defaults"

export function getPlayerMoney(ns: NS) : number {
    let reserve = Defaults.reserveMoney;
    let money = ns.getServerMoneyAvailable(Defaults.home);

    // Account for reserve
    if (money > reserve) {
        return money - reserve;
    } else {
        return 0;
    }
}

export function getPlayerHomeRam(ns: NS) : number {
    let reserve = Defaults.reserveRam;
    let ram = ns.getServerMaxRam(Defaults.home) - ns.getServerUsedRam(Defaults.home);

    // Account for reserve
    if (ram > reserve) {
        return ram - reserve;
    } else {
        return 0;
    }
}