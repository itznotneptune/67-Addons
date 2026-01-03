import Settings from "../configs"
import { registerWhen } from "../../BloomCore/utils/Utils"
import Dungeon from "../../BloomCore/dungeons/Dungeon"


let announced270 = false
let announced300 = false
let lastAnnounce300 = 0
let lastAnnounce270 = 0
const ANNOUNCE_COOLDOWN_MS = 3 * 1000 // 3 seconds
let Score = 0

if (Settings.scoreMilestonesPaul)

register("worldUnload", () => {
    announced270 = announced300 = false
})

registerWhen(register("tick", () => {
    if (Settings.scoreMilestonesPaul) {
        Score = Dungeon.score + 10
    } else {
        Score = Dungeon.score
    }
    if (!announced270 && Score >= 270) {
        const now = Date.now()
        const crypts = Dungeon.crypts
        if (now - lastAnnounce270 > ANNOUNCE_COOLDOWN_MS) {
            // ChatLib.command(`pc 哇哦，270分？我是不是在和一群挂機釣魚選手組隊啊？快把你們的劍拿出來，不然BOSS要笑死了！ (${Dungeon.time})`)
            if (crypts === 0) {
                ChatLib.command(`pc [67] 270 Score! (${Dungeon.time}) // No Crypts killed!`)
            }
            else if (crypts >= 1 && crypts < 5) {
                ChatLib.command(`pc [67] 270 Score! (${Dungeon.time}) // Only ${crypts}/5 Crypts killed!`)
            } else {
                ChatLib.command(`pc [67] 270 Score! (${Dungeon.time})`)
            }
            lastAnnounce270 = now
            announced270 = true
        }
        // Companion.showTitle("§6§l【270分保底歡樂園】打的慢但很有愛！")
    }
    if (!announced300 && Score >= 300) {
        const now2 = Date.now()
        const crypts = Dungeon.crypts
        if (now2 - lastAnnounce300 > ANNOUNCE_COOLDOWN_MS) {
            // ChatLib.command(`pc 300分？！這是地牢，不是動物園，大家終於把腦子帶來了呀！BOSS都感動哭了！ (${Dungeon.time})`)
            if (crypts === 0) {
                ChatLib.command(`pc [67] 300 Score! (${Dungeon.time}) // No Crypts killed!`)
            }
            else if (crypts >= 1 && crypts < 5) {
                ChatLib.command(`pc [67] 300 Score! (${Dungeon.time}) // Only ${crypts}/5 Crypts killed!`)
            } else {
                ChatLib.command(`pc [67] 300 Score! (${Dungeon.time})`)
            }
            lastAnnounce300 = now2
            announced300 = true
        }
        // Companion.showTitle("§6§l【300分養老速刷隊】打完一起去釣魚！")
    }
}), () => Settings.scoreMilestones)

// registerWhen(register("tick", () => {
//     if (!announced270 && Dungeon.score >= 270) {
//         ChatLib.command(`pc 哇哦，270分？我是不是在和一群挂機釣魚選手組隊啊？快把你們的劍拿出來，不然BOSS要笑死了！ (${Dungeon.time})`)
//         client.showTitle("§6§l【270分保底歡樂園】打的慢但很有愛！", 10, 40, 10)
//         announced270 = true
//     }
//     if (!announced300 && Dungeon.score >= 300) {
//         ChatLib.command(`pc 300分？！這是地牢，不是動物園，大家終於把腦子帶來了呀！BOSS都感動哭了！ (${Dungeon.time})`)
//         client.showTitle("§6§l【300分養老速刷隊】打完一起去釣魚！", 10, 40, 10)
//         announced300 = true
//     }
// }), () => Settings.scoreMilestones)