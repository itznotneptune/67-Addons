import { waData } from "./util"

//Love you bloom
let checked = false
register("step", () => {
    if (checked) return
    checked = true
    if (!waData.firstTime) return
    waData.firstTime = false 
    waData.save()
    ChatLib.chat(ChatLib.getChatBreak(" "))
    ChatLib.chat(ChatLib.getCenteredText(`&6&l[&3 Watcher Addons &r&7&o1.1&r&6&l ]&r`))
    ChatLib.chat(ChatLib.getCenteredText('&bThank you for downloading, let the blood camping begin!'))
    ChatLib.chat(ChatLib.getCenteredText('&bType &6&l/wa&r&b to get started.'))
    ChatLib.chat(ChatLib.getCenteredText('&bJoin the &9&lDiscord&r&b to report bugs, get help or just chat!'))
    ChatLib.chat(ChatLib.getChatBreak(" "))
}).setFps(2)