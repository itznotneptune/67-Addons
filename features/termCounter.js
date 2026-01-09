// ------------------------------ Import ------------------------------ \\

// import Settings from "../config.js"

// ------------------------------ Variables ------------------------------ \\

let term3 = false
let s2 = false
let s1EndMessage = "[BOSS] Goldor: I will replace that gate with a stronger one!"

// ------------------------------ Terminal Counter ------------------------------ \\

register("chat", () => {
    s2 = true
    ChatLib.chat("§a[67-Addons] §eS2 started!")
}).setCriteria(s1EndMessage)

register("chat", (event) => {
    if (s2) {
        if (term3 == false) {
            term3 = true
            let msg = null
            if (event && event.getMessage) {
                try { msg = event.getMessage().getUnformattedText() } catch (e) { try { msg = event.getMessage().toString() } catch (e) { msg = null } }
            } else if (event && event.message) msg = event.message
            else if (event && event.getString) {
                try { msg = event.getString() } catch (e) { msg = null }
            } else {
                try { msg = ChatLib.getChatMessage().getUnformattedText() } catch (e) { try { msg = String(ChatLib.getChatMessage()) } catch (e) { msg = null } }
            }
            if (typeof msg !== 'string') {
                try { msg = String(msg) } catch (e) { msg = null }
            }
            if (!msg) return
            let m = msg.match(/^(\S+)\s+activated a terminal! \(3\//)
            if (!m) return
            let name = m[1]

            ChatLib.chat(`§a[67-Addons] §eS2 Term 3 done! (${name})`)
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