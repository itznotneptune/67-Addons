// -------------------------------- IMPORTS -------------------------------- \\

import Settings from "../config"

// ------------------------------ Variables ------------------------------ \\

let nearPlayer = false
let nearPlayerName = null
const RADIUS = 1 // 0 blocks
const R2 = RADIUS * RADIUS
const LEAP_PREFIX = "§6[67 LeapCounter] §r"
const classCache = {}
let LEAP_DEBUG = false
const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction");
let p1 = true
let crystalLept = false
let p2 = false
let purpleLept = false
let sscLept = false
let p3 = false
let ssLept = 0
let mageSSLept = false
let tankSSLept = false
let bersSSLept = false
let archerSSLept = false
let ee2Lept = 0
let bersEE2Lept = false
let mageEE2Lept = false
let tankEE2Lept = false
let healerEE2Lept = false
let ee3Lept = 0
let bersEE3Lept = false
let tankEE3Lept = false
let archerEE3Lept = false
let ee4Lept = 0
let healerEE4Lept = false
let archerEE4Lept = false
let tankEE4Lept = false
let bersEE4Lept = false
let p4 = false
let p5 = false

// ------------------------------ Detection ------------------------------ \\

register("step", () => {
    if (!Settings.leapCounter) return
    const me = Player.getPlayer()
    if (!me) return

    const mx = Player.getX()
    const my = Player.getY()
    const mz = Player.getZ()

    let found = false
    let closestName = null
    let bestD2 = Infinity

    World.getAllPlayers().forEach(p => {
        if (!p) return
        if (p.getName() === Player.getName()) return

        const dx = p.getX() - mx
        const dy = p.getY() - my
        const dz = p.getZ() - mz
        const d2 = dx * dx + dy * dy + dz * dz

        if (d2 <= R2 && d2 < bestD2) {
            bestD2 = d2
            found = true
            closestName = p.getName()
        }
    })

    nearPlayer = found
    nearPlayerName = closestName
}).setFps(10) // increase/decrease as needed

register("chat", () => {
    p1 = true
    crystalLept = false
    p2 = false
    purpleLept = false
    sscLept = false
    p3 = false
    ssLept = 0
    mageSSLept = false
    tankSSLept = false
    bersSSLept = false
    archerSSLept = false
    ee2Lept = 0
    bersEE2Lept = false
    mageEE2Lept = false
    tankEE2Lept = false
    healerEE2Lept = false
    ee3Lept = 0
    bersEE3Lept = false
    tankEE3Lept = false
    archerEE3Lept = false
    ee4Lept = 0
    healerEE4Lept = false
    archerEE4Lept = false
    tankEE4Lept = false
    bersEE4Lept = false
    s1 = false
    s2 = false
    s3 = false
    s4 = false

    // nearPlayerClass = resolveClass(nearPlayerName)

    // if (nearPlayerClass == "Mage") {
    //     ChatLib.chat(`${LEAP_PREFIX} Mage: ${nearPlayerName}`)
    // }
    // else if (nearPlayerClass == "Archer") {
    //     ChatLib.chat(`${LEAP_PREFIX} Archer: ${nearPlayerName}`)
    // }
    // else if (nearPlayerClass == "Bers") {
    //     ChatLib.chat(`${LEAP_PREFIX} Bers: ${nearPlayerName}`)
    // }
    // else if (nearPlayerClass == "Healer") {
    //     ChatLib.chat(`${LEAP_PREFIX} Healer: ${nearPlayerName}`)
    // }
    // else if (nearPlayerClass == "Tank") {
    //     ChatLib.chat(`${LEAP_PREFIX} Tank: ${nearPlayerName}`)
    // }
    // ChatLib.chat(`${LEAP_PREFIX} Your class: ${resolveClass(Player.getName())}`)
}).setCriteria(`[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!`)

register("chat", () => {
    s3 = true
}).setCriteria(`[BOSS] Goldor: I will replace that gate with a stronger one!`)

// p1

register("step", () => {
    if (!Settings.crystalLeapCounter) return
    if (!crystalLept) {
        if (nearPlayer) { // true or false
            if (resolveClass(nearPlayerName) == "Mage") { // only counts mage leaps
                ChatLib.chat(`${LEAP_PREFIX} Mage Leaped: ${nearPlayerName}`)
                crystalLept = true
            }
        }
    }
}).setFps(1)

// p2

register("step", () => {
    if (!Settings.purpleLeapCounter) return
    if (!purpleLept) {
        if (nearPlayer) {
            if (resolveClass(nearPlayerName) == "Mage") {
                ChatLib.chat(`${LEAP_PREFIX} Mage Purple Leaped: ${nearPlayerName}`)
                purpleLept = true
            }
        }
    }
}).setFps(1)

// ssc leap

register("step", () => {
    if (!Settings.sscLeapCounter) return
    if (!sscLept) {
        if (nearPlayer) {
            if (resolveClass(nearPlayerName) == "Healer") {
                ChatLib.chat(`${LEAP_PREFIX} Healer SSC Leaped: ${nearPlayerName}`)
                sscLept = true
            }
        }
    }
}).setFps(1)

// ss leap

register("step", () => {
    if (!Settings.ssLeapCounter) return
    if (ssLept <= 4) {
        if (nearPlayer) {
            if (resolveClass(nearPlayerName) == "Mage") {
                if (mageSSLept == false) {
                    ssLept++
                    ChatLib.chat(`${LEAP_PREFIX} Mage SS Leaped: ${nearPlayerName} (${ssLept}/4)`)
                    mageSSLept = true
                }
            }
            else if (resolveClass(nearPlayerName) == "Tank") {
                if (tankSSLept == false) {
                    ssLept++
                    ChatLib.chat(`${LEAP_PREFIX} Tank SS Leaped: ${nearPlayerName} (${ssLept}/4)`)
                    tankSSLept = true
                }
            }
            else if (resolveClass(nearPlayerName) == "Bers") {
                if (bersSSLept == false) {
                    ssLept++
                    ChatLib.chat(`${LEAP_PREFIX} Bers SS Leaped: ${nearPlayerName} (${ssLept}/4)`)
                    bersSSLept = true
                }
            }
            else if (resolveClass(nearPlayerName) == "Archer") {
                if (archerSSLept == false) {
                    ssLept++
                    ChatLib.chat(`${LEAP_PREFIX} Archer SS Leaped: ${nearPlayerName} (${ssLept}/4)`)
                    archerSSLept = true
                }
            }
        }
    }
}).setFps(1)

// ee2 leap

register("step", () => {
    if (!Settings.ee2LeapCounter) return
    if (!s1) return
    if (ee2Lept <= 4) {
        if (nearPlayer) {
            if (resolveClass(nearPlayerName) == "Bers") {
                ee2Lept++
                ChatLib.chat(`${LEAP_PREFIX} Bers EE2 Leaped: ${nearPlayerName} (${ee2Lept}/4)`)
                bersEE2Lept = true
            }
            else if (resolveClass(nearPlayerName) == "Mage") {
                ee2Lept++
                ChatLib.chat(`${LEAP_PREFIX} Mage EE2 Leaped: ${nearPlayerName} (${ee2Lept}/4)`)
                mageEE2Lept = true
            }
            else if (resolveClass(nearPlayerName) == "Tank") {
                ee2Lept++
                ChatLib.chat(`${LEAP_PREFIX} Tank EE2 Leaped: ${nearPlayerName} (${ee2Lept}/4)`)
                tankEE2Lept = true
            }
            else if (resolveClass(nearPlayerName) == "Healer") {
                ee2Lept++
                ChatLib.chat(`${LEAP_PREFIX} Healer EE2 Leaped: ${nearPlayerName} (${ee2Lept}/4)`)
                healerEE2Lept = true
            }
        }
    }
}).setFps(1)

// ee3 leap

register("step", () => {
    if (!Settings.ee3LeapCounter) return
    if (!s2) return
    if (ee3Lept <= 3) {
        if (nearPlayer) {
            if (resolveClass(nearPlayerName) == "Bers") {
                ee3Lept++
                ChatLib.chat(`${LEAP_PREFIX} Bers EE3 Leaped: ${nearPlayerName} (${ee3Lept}/3)`)
                bersEE3Lept = true
            }
            else if (resolveClass(nearPlayerName) == "Tank") {
                ee3Lept++
                ChatLib.chat(`${LEAP_PREFIX} Tank EE3 Leaped: ${nearPlayerName} (${ee3Lept}/3)`)
                tankEE3Lept = true
            }
            else if (resolveClass(nearPlayerName) == "Archer") {
                ee3Lept++
                ChatLib.chat(`${LEAP_PREFIX} Archer EE3 Leaped: ${nearPlayerName} (${ee3Lept}/3)`)
                archerEE3Lept = true
            }
        }
    }
}).setFps(1)

// ee4 leap

register("step", () => {
    if (!Settings.ee4LeapCounter) return
    if (Player.getX() > 49.5 && Player.getX() < 53.5 && Player.getY() < 116 && Player.getY() > 114 && Player.getZ() > 53 && Player.getZ() < 56) {
        if (ee4Lept <= 4) {
            if (nearPlayer) {
                if (resolveClass(nearPlayerName) == "Healer") {
                    if (healerEE4Lept == false) {
                        ee4Lept++
                        ChatLib.chat(`${LEAP_PREFIX} Healer EE4 Leaped: ${nearPlayerName} (${ee4Lept}/4)`)
                        healerEE4Lept = true
                    }
                }
                else if (resolveClass(nearPlayerName) == "Archer") {
                    if (archerEE4Lept == false) {
                        ee4Lept++
                        ChatLib.chat(`${LEAP_PREFIX} Archer EE4 Leaped: ${nearPlayerName} (${ee4Lept}/4)`)
                        archerEE4Lept = true
                    }
                }
                else if (resolveClass(nearPlayerName) == "Tank") {
                    if (tankEE4Lept == false) {
                        ee4Lept++
                        ChatLib.chat(`${LEAP_PREFIX} Tank EE4 Leaped: ${nearPlayerName} (${ee4Lept}/4)`)
                        tankEE4Lept = true
                    }
                } 
                else if (resolveClass(nearPlayerName) == "Bers") {
                    if (bersEE4Lept == false) {
                        ee4Lept++
                        ChatLib.chat(`${LEAP_PREFIX} Bers EE4 Leaped: ${nearPlayerName} (${ee4Lept}/4)`)
                        bersEE4Lept = true
                    }
                }
            }
        }
    }
}).setFps(1)

register("command", () => {
    if (Player.getZ() > 49.5 && Player.getZ() < 53.5 && Player.getY() < 116 && Player.getY() > 114 && Player.getX() > 53 && Player.getX() < 56) {
        ChatLib.chat(`${LEAP_PREFIX} You are in EE4 leap zone.`)
    } else {
        ChatLib.chat(`${LEAP_PREFIX} You are NOT in EE4 leap zone.`)
    }
}).setName("ee4zone")

register("command", () => {
    if (ee4Lept >= 0) {
        ChatLib.chat(`${LEAP_PREFIX} EE4 leaps counted: ${ee4Lept}/4`)
    }
}).setName("ee4leaps")

// ------------------------------ Class Define ------------------------------ \\
register("chat", () => {
    if (!Settings.leapCounter) return
    Scoreboard.getLines().forEach(line => {
        let raw = line.getName()
        let text = ChatLib.removeFormatting(raw)
        .replace(/[^A-z0-9 \[\]]/g, "")

        // score line debug removed to avoid spam
        // if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "score line raw='" + raw + "' -> '" + text + "'")

        let cls = null

        if (text.startsWith("[M]")) cls = "Mage"
        else if (text.startsWith("[A]")) cls = "Archer"
        else if (text.startsWith("[B]")) cls = "Bers"
        else if (text.startsWith("[H]")) cls = "Healer"
        else if (text.startsWith("[T]")) cls = "Tank"

        if (!cls) return

        let name = text.replace(/\[.\]\s*/, "").trim()
        if (name.length > 0) classCache[name] = cls
        if (LEAP_DEBUG && name.length > 0) ChatLib.chat(`${LEAP_PREFIX} cached: ${name} -> ${cls}`)
    })
}).setCriteria(`[NPC] Mort: Good luck.`)

function resolveClass(name) {
    if (!name || typeof name !== "string") return null
    let best = null
    Object.keys(classCache).forEach(n => {
        if (name.startsWith(n) || n.startsWith(name)) {
            if (!best || n.length > best.length) best = n
        }
    })
    return best ? classCache[best] : null

    // original version
    // let best = null
    // Object.keys(classCache).forEach(n => {
    //     if (name.startsWith(n) || n.startsWith(name)) {
    //     if (!best || n.length > best.length) best = n
    //     }
    // })
    // return best ? classCache[best] : null
}

register("command", () => {
    playerClass = resolveClass(nearPlayerName)
    ChatLib.chat(`${LEAP_PREFIX} Player ${nearPlayerName} is class: ${playerClass}`)
}).setName("nearclass")

register("command", () => {
    playerClass = resolveClass(Player.getName())
    ChatLib.chat(`${LEAP_PREFIX} You are class: ${playerClass}`)
}).setName("class")

// ------------------------------ Debugging ------------------------------ \\

register("command", () => {
    ChatLib.chat(`${LEAP_PREFIX} nearPlayer = ${nearPlayer}, name = ${nearPlayerName}`)
}).setName("nearplayer")