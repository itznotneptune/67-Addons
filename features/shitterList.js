import Settings from "../config"

// Map storage: uuid -> username
const shitterMap = new Map()
const DATA_PATH = "67-Addons/data/shitterList.json"

function saveShitterList() {
    const arr = Array.from(shitterMap.entries()).map(([uuid, name]) => ({ uuid, name }))
    const json = JSON.stringify(arr, null, 2)
    // Try FileLib first (ChatTriggers helper)
    try {
        if (typeof FileLib !== "undefined" && FileLib.write) {
            try { FileLib.write(DATA_PATH, json) } catch (e) {}
        }
    } catch (e) {}

    // Also write using Java IO as a fallback/duplicate so reload contexts can read it reliably
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
    // Clear existing entries before loading
    shitterMap.clear()

    // Helper to parse and populate from various JSON shapes
    function populateFromJsonContent(content) {
        if (!content) return false
        try {
            const data = JSON.parse(content)
            // Support array of {uuid,name}
            if (Array.isArray(data)) {
                data.forEach(obj => { if (obj && obj.uuid) shitterMap.set(obj.uuid, obj.name || "") })
                return true
            }
            // Support object mapping uuid->name
            if (typeof data === 'object') {
                // detect mapping like { "uuid": "name", ... }
                const keys = Object.keys(data)
                if (keys.length && typeof data[keys[0]] === 'string') {
                    keys.forEach(k => shitterMap.set(k, data[k]))
                    return true
                }
            }
        } catch (e) {}
        return false
    }

    // Try FileLib first if available
    try {
        if (typeof FileLib !== "undefined" && FileLib.read) {
            try {
                const content = FileLib.read(DATA_PATH)
                if (populateFromJsonContent(content)) return
            } catch (e) {}
        }
    } catch (e) {}

    // Fallback to Java IO file path
    try {
        const f = new java.io.File("config/ChatTriggers/modules/67-Addons/data/shitterList.json")
        if (!f.exists()) return
        const br = new java.io.BufferedReader(new java.io.FileReader(f))
        let line, sb = ""
        while ((line = br.readLine()) != null) sb += line + "\n"
        br.close()
        populateFromJsonContent(sb)
    } catch (e) {}
}

loadShitterList()

// map of uuid -> chat listener handle
const chatListeners = new Map()

function registerListener(uuid, name) {
    try {
        const handler = register("chat", (event) => {
            try {
                ChatLib.chat(`§6[67Addons] §cDetected shitter: §e${name} §8(${uuid})`)
                new Sound({source: "shitter.ogg"}).setVolume(0.1)?.play();
            } catch (e) {}
        }).setCriteria(name).setContains()
        chatListeners.set(uuid, handler)
    } catch (e) {}
}

function unregisterListener(uuid) {
    try {
        const h = chatListeners.get(uuid)
        if (h && h.unregister) h.unregister()
    } catch (e) {}
    chatListeners.delete(uuid)
}

function refreshChatListeners() {
    try {
        // unregister existing
        for (const [uuid, h] of chatListeners.entries()) {
            try { if (h && h.unregister) h.unregister() } catch (e) {}
        }
        chatListeners.clear()
        // register for current entries
        for (const [uuid, name] of shitterMap.entries()) {
            registerListener(uuid, name)
        }
    } catch (e) {}
}

// fetch player data from playerdb.co; accepts username or uuid
function fetchPlayer(id) {
    try {
        const urlStr = "https://playerdb.co/api/player/minecraft/" + encodeURIComponent(id)
        const url = new java.net.URL(urlStr)
        const conn = url.openConnection()
        conn.setConnectTimeout(5000)
        conn.setReadTimeout(5000)
        // some environments require a UA
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
        ChatLib.chat(`§6[67Addons] §eResolving ${name}...`)
        const res = fetchPlayer(name)
        if (!res) return ChatLib.chat(`§6[67Addons] §cFailed to resolve ${name}.`)
        shitterMap.set(res.id, res.username)
        saveShitterList()
        registerListener(res.id, res.username)
        ChatLib.chat(`§6[67Addons] §aAdded §e${res.username} §ato the shitter list.`)
        return
    }

    if (action === "remove" || action === "rm" || action === "del") {
        if (!name) return ChatLib.chat("§6[67Addons] §cUsage: /shitter remove <name|uuid>")
        // try delete by uuid
        if (shitterMap.delete(name)) {
            saveShitterList()
            ChatLib.chat(`§6[67Addons] §aRemoved §e${name} §afrom the shitter list.`)
            return
        }
        // try delete by username (case-insensitive)
        const found = Array.from(shitterMap.entries()).find(([uuid, uname]) => uname.toLowerCase() === name.toLowerCase())
        if (found) {
            shitterMap.delete(found[0])
            saveShitterList()
            unregisterListener(found[0])
            ChatLib.chat(`§6[67Addons] §aRemoved §e${found[1]} §afrom the shitter list.`)
        } else {
            ChatLib.chat(`§6[67Addons] §c${name} was not in the shitter list.`)
        }
        return
    }

    if (action === "list") {
        const arr = Array.from(shitterMap.entries())
        if (!arr.length) return ChatLib.chat("§6[67Addons] §eShitter list is empty.")
        ChatLib.chat("§6[67Addons] §eShitter list:")
        arr.forEach(([uuid, uname]) => ChatLib.chat(` §7- §e${uname} §8(${uuid})`))
        return
    }

    if (action === "fix") {
        if (!shitterMap.size) return ChatLib.chat("§6[67Addons] §eShitter list is empty.")
        ChatLib.chat("§6[67Addons] §eRefreshing names from playerdb... This may take a moment.")
        const updates = []
        for (const [uuid, oldName] of Array.from(shitterMap.entries())) {
            const res = fetchPlayer(uuid)
            if (!res) continue
            if (res.username !== oldName) {
                shitterMap.set(uuid, res.username)
                updates.push({ uuid, from: oldName, to: res.username })
                // update listener for the new name
                unregisterListener(uuid)
                registerListener(uuid, res.username)
            }
        }
        if (updates.length) {
            saveShitterList()
            updates.forEach(u => ChatLib.chat(`§6[67Addons] §aUpdated §e${u.from} §ato §e${u.to} §8(${u.uuid})`))
        } else {
            ChatLib.chat("§6[67Addons] §aAll names are up-to-date.")
        }
        return
    }

    ChatLib.chat(`§6[67Addons] §cUnknown subcommand: ${action}. Use /shitter help`)
}).setName("shitter")
// refresh listeners on load
refreshChatListeners()
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