import Settings from "../config"

// Map storage: uuid -> { name, rank }
const shitterMap = new Map()
const DATA_PATH = "67-Addons/data/shitterList.json"
let color = "§7"

function saveShitterList() {
    const arr = Array.from(shitterMap.entries()).map(([uuid, info]) => ({
        uuid,
        name: info.name,
        rank: info.rank || null,
        monthlyRankColor: info.monthlyRankColor || null,
        monthlyPackageRank: info.monthlyPackageRank || null
    }))
    const json = JSON.stringify(arr, null, 2)
    try {
        if (typeof FileLib !== "undefined" && FileLib.write) {
            FileLib.write(DATA_PATH, json)
            return
        }
    } catch (e) {}

    try {
        const File = java.io.File
        const parent = new File("config/ChatTriggers/modules/67-Addons/data")
        if (!parent.exists()) parent.mkdirs()
        const f = new File(parent, "shitterList.json")
        const fw = new java.io.FileWriter(f)
        fw.write(json)
        fw.close()
    } catch (e) {}
}

function loadShitterList() {
    try {
        if (typeof FileLib !== "undefined" && FileLib.read) {
            const content = FileLib.read(DATA_PATH)
            if (content) {
                const arr = JSON.parse(content)
                arr.forEach(obj => shitterMap.set(obj.uuid, { name: obj.name, rank: obj.rank || null, monthlyRankColor: obj.monthlyRankColor || null, monthlyPackageRank: obj.monthlyPackageRank || null }))
            }
            return
        }
    } catch (e) {}

    try {
        const f = new java.io.File("config/ChatTriggers/modules/67-Addons/data/shitterList.json")
        if (!f.exists()) return
        const br = new java.io.BufferedReader(new java.io.FileReader(f))
        let line, sb = ""
        while ((line = br.readLine()) != null) sb += line + "\n"
        br.close()
        const arr = JSON.parse(sb)
        arr.forEach(obj => shitterMap.set(obj.uuid, { name: obj.name, rank: obj.rank || null, monthlyRankColor: obj.monthlyRankColor || null, monthlyPackageRank: obj.monthlyPackageRank || null }))
    } catch (e) {}
}

loadShitterList()

// read Hypixel key from absolute path if exists
function readHypixelKey() {
    try {
        // try FileLib first
        if (typeof FileLib !== "undefined" && FileLib.read) {
            if (FileLib.exists("", "hypixel_api.txt")) {
                return FileLib.read("", "hypixel_api.txt").trim()
            }
        }
    } catch (e) {}
    try {
        const p = new java.io.File("D:/sb/config/ChatTriggers/hypixel_api.txt")
        if (!p.exists()) return null
        const br = new java.io.BufferedReader(new java.io.FileReader(p))
        const key = br.readLine()
        br.close()
        return key ? String(key).trim() : null
    } catch (e) {}
    return null
}

const HYPIXEL_KEY = readHypixelKey()

// fetch player data from playerdb.co; accepts username or uuid
function fetchPlayerUUID(id) {
    try {
        const urlStr = "https://playerdb.co/api/player/minecraft/" + encodeURIComponent(id)
        const url = new java.net.URL(urlStr)
        const conn = url.openConnection()
        conn.setConnectTimeout(5000)
        conn.setReadTimeout(5000)
        conn.setRequestProperty && conn.setRequestProperty("User-Agent", "ChatTriggers")
        const is = conn.getInputStream()
        const reader = new java.io.BufferedReader(new java.io.InputStreamReader(is))
        let line, sb = ""
        while ((line = reader.readLine()) != null) sb += line
        reader.close()
        const obj = JSON.parse(sb)
        if (obj && obj.success && obj.data && obj.data.player) {
            return { id: obj.data.player.id, username: obj.data.player.username }
        }
    } catch (e) {}
    return null
}

// fetch Hypixel player data (returns object with rank + monthly fields)
function fetchHypixelRank(uuid) {
    if (!HYPIXEL_KEY) return { rank: null, monthlyRankColor: null, monthlyPackageRank: null }
    try {
        const urlStr = "https://api.hypixel.net/player?key=" + encodeURIComponent(HYPIXEL_KEY) + "&uuid=" + encodeURIComponent(uuid)
        const url = new java.net.URL(urlStr)
        const conn = url.openConnection()
        conn.setConnectTimeout(5000)
        conn.setReadTimeout(5000)
        conn.setRequestProperty && conn.setRequestProperty("User-Agent", "ChatTriggers")
        const is = conn.getInputStream()
        const reader = new java.io.BufferedReader(new java.io.InputStreamReader(is))
        let line, sb = ""
        while ((line = reader.readLine()) != null) sb += line
        reader.close()
        const obj = JSON.parse(sb)
        console.log("67-Addons: hypixel player response:", obj)
        if (obj && obj.success && obj.player) {
            const p = obj.player
            const rank = p.newPackageRank || p.monthlyPackageRank || p.packageRank || p.rank || null
            const monthlyRankColor = p.monthlyRankColor || null
            const monthlyPackageRank = p.monthlyPackageRank || null
            return { rank, monthlyRankColor, monthlyPackageRank }
        }
        console.log("67-Addons: hypixel response missing player for", uuid)
    } catch (e) { console.log(e) }
    return { rank: null, monthlyRankColor: null, monthlyPackageRank: null }
}

register("command", (sub, name) => {
    if (!Settings.shitterList) return

    const action = (sub || "").toLowerCase()

    if (!action || action === "help") {
        ChatLib.chat("§6[67Addons] §e/shitter add <username> §7- add a player (resolves UUID)")
        ChatLib.chat("§6[67Addons] §e/shitter remove <name|uuid> §7- remove a player")
        ChatLib.chat("§6[67Addons] §e/shitter list §7- list all players")
        ChatLib.chat("§6[67Addons] §e/shitter fix §7- refresh usernames from UUIDs via playerdb")
        return
    }

    if (action === "add") {
        if (!name) return ChatLib.chat("§6[67Addons] §cUsage: /shitter add <username>")
        ChatLib.chat("§6[67Addons] §eResolving " + name + "...")
        const res = fetchPlayerUUID(name)
        if (!res) return ChatLib.chat("§6[67Addons] §cFailed to resolve " + name + ".")
        const rankInfo = fetchHypixelRank(res.id)
        const rr = rankInfo && rankInfo.rank ? rankInfo.rank : null
        if (rr) {
            if (rr == "VIP" || rr == "VIP_PLUS") {
                color = "§a"
            } else if (rr == "MVP" || rr == "MVP_PLUS") {
                color = "§b"
            } 
            if (!rankInfo.monthlyPackageRank) return
            if (rankInfo.monthlyPackageRank == "SUPERSTAR") {
                if (rankInfo.monthlyRankColor === "GOLD") {
                    color = "§6"
                } else if (rankInfo.monthlyRankColor === "BLUE") {
                    color = "§b"
                }
                else {
                    color = "§6"
                }
            } else {
                color = "§7"
            }
        }
        shitterMap.set(res.id, { name: res.username, rank: rr, monthlyRankColor: rankInfo.monthlyRankColor || null, monthlyPackageRank: rankInfo.monthlyPackageRank || null })
        saveShitterList()
        let addMsg = "\u00A76[67Addons] \u00A7aAdded \u00A7e" + res.username + " (" + color + (rr || "") + "\u00A7r)"
        addMsg += " to the shitter list."
        ChatLib.chat(addMsg)
        return
    }

    if (action === "remove" || action === "rm" || action === "del") {
        if (!name) return ChatLib.chat("§6[67Addons] §cUsage: /shitter remove <name|uuid>")
        // try delete by uuid
        if (shitterMap.delete(name)) {
            saveShitterList()
            ChatLib.chat("\u00A76[67Addons] \u00A7aRemoved \u00A7e" + name + " \u00A7afrom the shitter list.")
            return
        }
        // try delete by username (case-insensitive)
        const found = Array.from(shitterMap.entries()).find(([uuid, info]) => info.name.toLowerCase() === name.toLowerCase())
        if (found) {
            shitterMap.delete(found[0])
            saveShitterList()
            ChatLib.chat("\u00A76[67Addons] \u00A7aRemoved \u00A7e" + found[1].name + " \u00A7afrom the shitter list.")
        } else {
            ChatLib.chat("\u00A76[67Addons] \u00A7c" + name + " was not in the shitter list.")
        }
        return
    }

    if (action === "list") {
        const arr = Array.from(shitterMap.entries())
        if (!arr.length) return ChatLib.chat("§6[67Addons] §eShitter list is empty.")
        ChatLib.chat("§6[67Addons] §eShitter list:")
        arr.forEach(([uuid, info]) => {
            let line = " \u00A77- \u00A7e" + info.name + " \u00A78(" + uuid + ")"
            if (info.rank) line += " \u00A77- \u00A7e" + info.rank
            if (info.monthlyPackageRank) line += " \u00A77( monthly: \u00A7e" + info.monthlyPackageRank + " )"
            ChatLib.chat(line)
        })
        return
    }

    if (action === "fix") {
        if (!shitterMap.size) return ChatLib.chat("§6[67Addons] §eShitter list is empty.")
        ChatLib.chat("§6[67Addons] §eRefreshing names from playerdb... This may take a moment.")
        const updates = []
        for (const [uuid, info] of Array.from(shitterMap.entries())) {
            const res = fetchPlayerUUID(uuid)
            if (!res) continue
            if (res.username !== info.name) {
                shitterMap.set(uuid, { name: res.username, rank: info.rank || null, monthlyRankColor: info.monthlyRankColor || null, monthlyPackageRank: info.monthlyPackageRank || null })
                updates.push({ uuid, from: info.name, to: res.username })
            }
        }
        if (updates.length) {
            saveShitterList()
            updates.forEach(u => ChatLib.chat("\u00A76[67Addons] \u00A7aUpdated \u00A7e" + u.from + " \u00A7ato \u00A7e" + u.to + " \u00A78(" + u.uuid + ")"))
        } else {
            ChatLib.chat("\u00A76[67Addons] \u00A7aAll names are up-to-date.")
        }
        return
    }

    ChatLib.chat("\u00A76[67Addons] \u00A7cUnknown subcommand: " + action + ". Use /shitter help")
}).setName("shitter")

// Example chat scanner (optional) - match by username case-insensitive
register("chat", (event) => {
    if (!Settings.shitterList) return
    let msg = ""
    try {
        msg = event && event.getMessage ? event.getMessage() : String(event || "")
    } catch (e) {
        msg = String(event || "")
    }
    if (!msg) return
    for (const [uuid, info] of shitterMap.entries()) {
        if (!info || !info.name) continue
        if (msg.toLowerCase().includes(info.name.toLowerCase())) {
            // DO SOMETHING when match found, e.g., notify
            ChatLib.chat("\u00A76[67Addons] \u00A7cDetected shitter: \u00A7e" + info.name + " \u00A78(" + uuid + ")")
            break
        }
    }
})
// import Settings from "../config"

// const shitterList = new Set()
// const DATA_PATH = "67-Addons/data/shitterList.json"

// function saveShitterList() {
//     const arr = Array.from(shitterList)
//     const json = JSON.stringify(arr, null, 2)
//     try {
//         // preferred: use FileLib when available (ChatTriggers helper)
//         if (typeof FileLib !== "undefined" && FileLib.write) {
//             FileLib.write(DATA_PATH, json)
//             return
//         }
//     } catch (e) {}

//     // fallback: Java IO
//     try {
//         const File = java.io.File
//         const parent = new File("config/ChatTriggers/modules/67-Addons/data")
//         if (!parent.exists()) parent.mkdirs()
//         const f = new File(parent, "shitterList.json")
//         const fw = new java.io.FileWriter(f)
//         fw.write(json)
//         fw.close()
//     } catch (e) {}
// }

// function loadShitterList() {
//     try {
//         if (typeof FileLib !== "undefined" && FileLib.read) {
//             const content = FileLib.read(DATA_PATH)
//             if (content) {
//                 const arr = JSON.parse(content)
//                 arr.forEach(x => shitterList.add(x))
//             }
//             return
//         }
//     } catch (e) {}

//     try {
//         const f = new java.io.File("config/ChatTriggers/modules/67-Addons/data/shitterList.json")
//         if (!f.exists()) return
//         const br = new java.io.BufferedReader(new java.io.FileReader(f))
//         let line, sb = ""
//         while ((line = br.readLine()) != null) sb += line + "\n"
//         br.close()
//         const arr = JSON.parse(sb)
//         arr.forEach(x => shitterList.add(x))
//     } catch (e) {}
// }

// loadShitterList()

// register("command", (sub, name) => {
//     if (!Settings.shitterList) return

//     const action = (sub || "").toLowerCase()

//     if (!action || action === "help") {
//         ChatLib.chat("§6[67Addons] §e/shitter add <name> §7- add a name")
//         ChatLib.chat("§6[67Addons] §e/shitter remove <name> §7- remove a name")
//         ChatLib.chat("§6[67Addons] §e/shitter list §7- list all names")
//         return
//     }

//     if (action === "add") {
//         if (!name) return ChatLib.chat("§6[67Addons] §cUsage: /shitter add <name>")
//         shitterList.add(name)
//         saveShitterList()
//         ChatLib.chat(`§6[67Addons] §aAdded §e${name} §ato the shitter list.`)
//         return
//     }

//     if (action === "remove" || action === "rm" || action === "del") {
//         if (!name) return ChatLib.chat("§6[67Addons] §cUsage: /shitter remove <name>")
//         if (shitterList.delete(name)) {
//             saveShitterList()
//             ChatLib.chat(`§6[67Addons] §aRemoved §e${name} §afrom the shitter list.`)
//         } else {
//             ChatLib.chat(`§6[67Addons] §c${name} was not in the shitter list.`)
//         }
//         return
//     }

//     if (action === "list") {
//         const arr = Array.from(shitterList)
//         if (!arr.length) return ChatLib.chat("§6[67Addons] §eShitter list is empty.")
//         ChatLib.chat("§6[67Addons] §eShitter list: §7" + arr.join(", "))
//         return
//     }

//     ChatLib.chat(`§6[67Addons] §cUnknown subcommand: ${action}. Use /shitter help`)
// }).setName("shitter")