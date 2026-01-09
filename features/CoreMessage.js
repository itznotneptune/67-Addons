import Settings from "../config"
import ticks from "../util/ticks"

let sentmsg = false
let p3done = false
let timesincep3done = 0
let lastPlayerName = ""
let lastPlayerTime = 0
let playersincorelist = ""
let accountfortpsdifference = false
let delaybetweenscanandstart = 0
let playerCoreTimes = {}

const tickListener = () => {
    if (p3done && Settings.coremsg) {
        if (accountfortpsdifference) {
            accountfortpsdifference = false
            delaybetweenscanandstart = parseFloat((((Date.now() - timesincep3done) / 1000).toFixed(3)) + 0.001)
        }

        World.getAllPlayers().forEach(entity => {
            const name = entity.getName()
            if (!playersincorelist.includes(name)) {
                if (entity.isInvisible() || entity.getPing() !== 1) return

                if ((entity.getX() < 71) && (entity.getX() >= 39) &&
                    (entity.getY() < 155.5) && (entity.getY() >= 112) &&
                    (entity.getZ() < 118) && (entity.getZ() >= 54)) {

                    if ((Date.now() - timesincep3done) > ((delaybetweenscanandstart * 1000) + 7)) {
                        const timeTaken = (((Date.now() - timesincep3done) / 1000) - delaybetweenscanandstart).toFixed(3)
                        lastPlayerName = name
                        lastPlayerTime = timeTaken
                        playersincorelist += name
                        playerCoreTimes[name] = timeTaken
                    }
                }
            }
        })
    }
}

register("chat", () => {
    ticks.addListener(tickListener)
    timesincep3done = Date.now()
    p3done = true
    accountfortpsdifference = true
}).setCriteria("The Core entrance is opening!");

function sendLastPlayerCoreMessage() {
    if (!Settings.coremsg && !sentmsg) {
        // Send all players’ core times
        Object.entries(playerCoreTimes).forEach(([name, time]) => {
            ChatLib.chat(`§b[&f67&b] §f${name} has entered core in §b${time}s`)
        })

        // Send last player to enter core
        if (lastPlayerName !== "") {
            ChatLib.command(`pc ${lastPlayerName} was last to enter core at ${lastPlayerTime}s`)
        }
    }

    ticks.removeListener(tickListener)
    sentmsg = true
    p3done = false
    lastPlayerName = ""
    lastPlayerTime = 0
    playersincorelist = ""
    playerCoreTimes = {}
}

register("chat", sendLastPlayerCoreMessage).setCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")

register("worldUnload", () => {
    p3done = false
    sentmsg = false
    lastPlayerName = ""
    lastPlayerTime = 0
    playersincorelist = ""
    accountfortpsdifference = false
    playerCoreTimes = {}
    ticks.removeListener(tickListener)
})
