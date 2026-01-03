import config from "../config"
import { prefix, getRoom, getRoomID, getClass } from "../util/util"
import { registerWhen } from "../../BloomCore/utils/Utils"
import DmapDungeon from "../components/DmapDungeon"

let runStarted = null
let rooms = []
let roomTimes = []
let inBr = false
let messageSent = false
let omitRooms = ["Entrance", "Fairy", "Blood"]

registerWhen(register("chat", () => {
    runStarted = Date.now()
    roomTimes.push(0)
    inBr = true
}).setCriteria("[NPC] Mort: Here, I found this map when I first entered the dungeon."), () => config.bloodRushSplits)

registerWhen(register("chat", () => {
    if (config.showOnEveryClass && getClass() != "Archer" && getClass() != "Mage") return
    roomTimes.push(Date.now() - runStarted)
}).setCriteria(/.+ opened a WITHER door!/), () => config.bloodRushSplits)

registerWhen(register("chat", () => {
    if (config.showOnEveryClass && getClass() != "Archer" && getClass() != "Mage") return
    roomTimes.push(Date.now() - runStarted)
    const bloodRoute = DmapDungeon.dungeonMap.getRoomsTo(DmapDungeon.getRoomFromName("Entrance"), DmapDungeon.getRoomFromName("Blood"), false)
    bloodRoute.forEach(room => {
        if (!omitRooms.includes(room.name)) rooms.push(room.name)
    })
    let message = `\n${prefix} &4&lBlood Rush Splits: `
    for (let i = 0; i < rooms.length; ++i) {
        let individualTime = ((roomTimes[i + 1] - roomTimes[i]) / 1000).toFixed(2)
        message += `\n&a${rooms[i]}: &e${individualTime}s `
    }
    message += "\n"
    ChatLib.chat(message)
    inBr = false
    messageSent = true
}).setCriteria("The BLOOD DOOR has been opened!"), () => config.bloodRushSplits && !messageSent)

register("worldLoad", () => {
    runStarted = null
    rooms = []
    roomTimes = []
    inBr = false
    messageSent = false
})

register("command", () => {
    const bloodRoute = DmapDungeon.dungeonMap.getRoomsTo(DmapDungeon.getRoomFromName("Entrance"), DmapDungeon.getRoomFromName("Blood"), false)
    bloodRoute.forEach(room => {
        if (!omitRooms.includes(room.name)) rooms.push(room.name)
    })
}).setName("bloodrushrooms")