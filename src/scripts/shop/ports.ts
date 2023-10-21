import { NS } from "@ns";

// import * as Defaults from "../utils/defaults"
import * as Defaults from "scripts/utils/defaults"
import {getAvailablePorts} from "scripts/utils/hack-utils"
// import {getAvailablePorts} from "../utils/hack-utils"

export async function main(ns: NS): Promise<void> {
    // Stop script if Tor Router not bought already
    //      Should automate this later
    if (!ns.hasTorRouter())  {
        return;
    }
    
    // Available ports
    let ports = getAvailablePorts(ns);
    
    // money available setting aside the reserve
    let moneyAvailable = ns.getServerMoneyAvailable(Defaults.home) - Defaults.reserveMoney;
}