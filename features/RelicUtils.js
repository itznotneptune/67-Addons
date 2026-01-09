import Settings from "../config"
import { registerWhen, MouseEvent, getObjectXYZ } from "../../BloomCore/utils/Utils"
import { renderFilledBox } from "../../BloomCore/RenderUtils"
import { prefix } from "../util/util"

let relic
let relicCoords = {
    Green: [49, 7, 44, 85, 255, 85],
    Red: [51, 7, 42, 255, 85, 85],
    Purple: [54, 7, 41, 255, 85, 255],
    Orange: [57, 7, 42, 255, 170, 0],
    Blue: [59, 7, 44, 85, 255, 255]
}

registerWhen(register("chat", (name, relicPicked) => {
    if (name != Player.getName()) return
    relic = relicPicked
}).setCriteria(/(\w+) picked the Corrupted (\w+) Relic!/), () => Settings.highlightCauldron || Settings.blockRelicClicks)

registerWhen(register("renderWorld", () => {
    if (!relic) return
    drawHighlight(relic)
}), () => relic && Settings.highlightCauldron)

registerWhen(register(MouseEvent, (event) => {
    const btn = event.button
    const btnState = event.buttonstate

    if ((btn !== 0 && btn !== 1) || !btnState) return

    const la = Player.lookingAt()

    if (!la || !(la instanceof Block)) return

    const [x, y, z] = getObjectXYZ(la)
    const blockClicked = World.getBlockAt(x, y, z).type.getRegistryName()
    if ((blockClicked != 'minecraft:cauldron' && blockClicked != 'minecraft:anvil') || (!Player.getHeldItem()?.getName()?.includes('Relic') && !Player.getHeldItem()?.getName()?.includes('SkyBlock Menu'))) return

    if (checkCauldron(relic, x, y, z)) {
        relic = null
    } else {
        ChatLib.chat(`${prefix} &cWrong cauldron, silly!`)
        cancel(event)
    }
    
}), () => relic && Settings.blockRelicClicks)

// returns T or F
function checkCauldron(relic, x, y, z) {
    if (relicCoords[relic][0] == x && (relicCoords[relic][1] == y || relicCoords[relic][1] == (y + 1)) && relicCoords[relic][2] == z) return true
    return false
}

function drawHighlight(relic) {
    let x = relicCoords[relic][0] + 0.5
    let y = relicCoords[relic][1] - 0.005
    let z = relicCoords[relic][2] + 0.5
    let r = relicCoords[relic][3] / 255
    let g = relicCoords[relic][4] / 255
    let b = relicCoords[relic][5] / 255
    renderFilledBox(x, y, z, 1.005, 1.01, r, g, b, 1, Settings.cauldronPhase)
}

register("worldLoad", () => {
    relic = null
})