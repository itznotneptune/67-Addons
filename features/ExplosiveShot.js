import { formatNumber } from "../util/util"
import { registerWhen } from "../../BloomCore/utils/Utils"
import Settings from "../config"

registerWhen(register("chat", (enemies, totalDamage) => {
    let dmg = Number(totalDamage.replaceAll(",", ""))
    let unitdmg = formatNumber(dmg / enemies)
    ChatLib.command(`pc Explosive shot did ${unitdmg} damage per enemy.`)
}).setCriteria(/Your Explosive Shot hit (\d+) enemies for ([\d,\.]+) damage./), () => Settings.explo)