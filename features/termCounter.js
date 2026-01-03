// ------------------------------ Import ------------------------------ \\

import Settings from "../configs.js"

// ------------------------------ Variables ------------------------------ \\

let term3 = false
let s2 = false
let s1EndMessage = "[BOSS] Goldor: I will replace that gate with a stronger one!"

// ------------------------------ Terminal Counter ------------------------------ \\

register("chat", () => {
    s2 = true
    ChatLib.chat("§a[67-Addons] §eS2 started!")
}).setCriteria(s1EndMessage)

register("chat", () => {
    if (s2) {
        if (term3 == false) {
            term3 = true
            ChatLib.chat(`§a[67-Addons] §eS2 Term 3 done! (${term3Player})`)
        }
    }
}).setCriteria(/^(\S+) activated a terminal! \(3/).setStart()

// ------------------------------ Reset on World Load ------------------------------ \\

register("worldUnload", () => {
    if (term3 || s2) {
        term3 = false
        s2 = false
        ChatLib.chat("§a[67-Addons] §eS2 Term 3 counter reset!")
    }
})