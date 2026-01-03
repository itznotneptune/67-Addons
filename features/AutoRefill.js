import config from "../config"
import { prefix } from "../util/util"

register("step", () => {
    if (config.autoRefillPearls) return
    const pearlStack = Player.getInventory()?.getItems()?.find(a => a?.getName() == "§fEnder Pearl")

        if (pearlStack) {
            let stackSize = pearlStack.getStackSize()
            if (stackSize < config.autoRefillPearlsThreshold) {
                const toGive = 16 - stackSize
                ChatLib.chat(`${prefix} &aGetting Ender Pearls!`)
                ChatLib.command(`gfs ender_pearl ${toGive}`, false)
            }
        }
}).setDelay(4)

register("step", () => {
    if (config.autoRefillJerries) return
    const jerryStack = Player.getInventory()?.getItems()?.find(a => a?.getName() == "§fInflatable Jerry")

        if (jerryStack) {
            let stackSize = jerryStack.getStackSize()
            if (stackSize < config.autoRefillJerriesThreshold) {
                const toGive = 64 - stackSize
                setTimeout(() => {
                    ChatLib.chat(`${prefix} &aGetting Jerries!`)
                    ChatLib.command(`gfs inflatable_jerry ${toGive}`, false)
                }, 2000)
            }
        }
}).setDelay(4)

register("step", () => {
    if (config.autoRefillSuperBoom) return
    const jerryStack = Player.getInventory()?.getItems()?.find(a => a?.getName() == "§fSuperBoom TNT")

        if (jerryStack) {
            let stackSize = jerryStack.getStackSize()
            if (stackSize < config.autoRefillTNTThreshold) {
                const toGive = 64 - stackSize
                setTimeout(() => {
                    ChatLib.chat(`${prefix} &aGetting TNT!`)
                    ChatLib.command(`gfs SuperBoom_TNT  ${toGive}`, false)
                }, 2000)
            }
        }
}).setDelay(4)