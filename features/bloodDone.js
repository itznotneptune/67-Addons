// -------------------------------------- Imports -------------------------------------- \\

import Settings from "../config"

// -------------------------------------- Variables -------------------------------------- \\

let bloodDone = false

// -------------------------------------- Blood Done Detection -------------------------------------- \\

register("chat", () => {
    if (!Settings.bloodDone) return
        bloodDone = true
        ChatLib.command(`pc [67] Blood Done!`)
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.")

// -------------------------------------- Reset on World Load -------------------------------------- \\

register("worldUnload", () => {
    bloodDone = false
})