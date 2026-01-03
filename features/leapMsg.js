import Settings from "../configs"

let LEAP_DEBUG = false
const D_PREFIX = "§6[leapDbg] §r"

const classCache = {}

// Basic interval shim for CTJS (game ticks ~50ms). Provides setInterval/clearInterval used by this module.
const _intervals = {};
let _nextIntervalId = 1;
function setInterval(fn, ms) {
  const id = _nextIntervalId++;
  _intervals[id] = { fn: fn, ticks: Math.max(1, Math.round(ms / 50)), counter: 0 };
  return id;
}
function clearInterval(id) {
  try { delete _intervals[id]; } catch (e) {}
}

function leapSound() {
    new Sound({source: "../assets/leapSound.wav"})?.play();
}

register("step", () => {
  try {
    for (let id in _intervals) {
      const it = _intervals[id];
      it.counter++;
      if (it.counter >= it.ticks) {
        try { it.fn(); } catch (e) { if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "interval error: " + e); }
        it.counter = 0;
      }
    }
  } catch (e) {}
});

function _appendLog(line) {
  try { FileLib.write("67-Addons", "leap_debug.log", new Date().toISOString() + " - " + line + "\n", true); } catch (e) { if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "file write error: " + e); }
}

function sendLeapCommand(cmd) {
  if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "attempting send: " + cmd)
  _appendLog("attempting send: " + cmd)
  // Try ChatLib.command without and with leading slash
  try { ChatLib.command(cmd); _appendLog("ChatLib.command attempted: " + cmd); if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "ChatLib.command attempted: " + cmd); } catch (e) { _appendLog("ChatLib.command error: " + e); if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "ChatLib.command error: " + e); }
//   try { ChatLib.command('/' + cmd); _appendLog("ChatLib.command attempted: /" + cmd); if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "ChatLib.command attempted: /" + cmd); } catch (e) { _appendLog("ChatLib.command(/) error: " + e); if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "ChatLib.command(/) error: " + e); }

  // Fallback to direct player send
  try {
    const mc = Java.type('net.minecraft.client.Minecraft').getMinecraft();
    const player = mc.field_71439_g || mc.player || null;
    if (player && player.func_71165_d) {
      try { player.func_71165_d(cmd); _appendLog("player.func_71165_d attempted: " + cmd); if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "player.func_71165_d attempted: " + cmd); } catch (e) { _appendLog("player.func_71165_d error: " + e); if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "player.func_71165_d error: " + e); }
      try { player.func_71165_d('/' + cmd); _appendLog("player.func_71165_d attempted: /" + cmd); if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "player.func_71165_d attempted: /" + cmd); } catch (e) { _appendLog("player.func_71165_d(/) error: " + e); if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "player.func_71165_d(/) error: " + e); }
    }
  } catch (e) {
    _appendLog("player fallback outer error: " + e)
    if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "player fallback outer error: " + e)
  }
}

function extractTextFromEvent(event) {
  try {
    let msgObj = null
    if (event.getMessage) msgObj = event.getMessage()
    else if (event.message) msgObj = event.message
    else if (event.getString) msgObj = event.getString()
    if (!msgObj) return null

    if (typeof msgObj === 'string') return msgObj

    // Try common ITextComponent methods
    try { if (msgObj.getUnformattedText) return msgObj.getUnformattedText(); } catch (e) {}
    try { if (msgObj.getFormattedText) return msgObj.getFormattedText(); } catch (e) {}
    try { if (msgObj.getUnformattedTextForChat) return msgObj.getUnformattedTextForChat(); } catch (e) {}

    // Fallback to toString
    try { return String(msgObj.toString()); } catch (e) { return null }
  } catch (e) { return null }
}

function isLeapEnabled() {
  // some configs use LeapMsg (capital L) while code used leapMsg
  if (typeof Settings.leapMsg !== 'undefined') return !Settings.leapMsg
  if (typeof Settings.LeapMsg !== 'undefined') return !Settings.LeapMsg
  return false
}

// Global chat logger (only when LEAP_DEBUG is true) to capture raw teleport messages
register("chat", (event) => {
  if (!LEAP_DEBUG) return
  try {
    let raw = ""
    if (event.getMessage) {
      try { raw = event.getMessage().getUnformattedText(); } catch (_) { raw = event.getMessage().toString(); }
    } else if (event.message) raw = event.message
    else if (event.getString) raw = event.getString()
    ChatLib.chat(D_PREFIX + "RAW_CHAT: " + (raw || "<empty>"))
  } catch (e) {
    ChatLib.chat(D_PREFIX + "RAW_CHAT_ERR: " + e)
  }
})

// Detect party leap messages with a heart icon: e.g. "Party > ...: ❤ owo67"
register("chat", (event) => {
  if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "Settings.leapMsg: " + !Settings.leapMsg)
  if (Settings.leapMsg) return

  try {
    let raw = extractTextFromEvent(event)
    if (!raw) return

    if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "parse chat for leap: " + raw)

    // quick check: must be party message and contain heart symbol
    if (!raw.includes("Party") || !raw.includes("❤")) return

    // extract the name after the heart (handles variations like '❤ name' or '❤name')
    let m = raw.match(/❤\s*(\S+)/)
    if (!m || !m[1]) return
    let name = m[1].trim()
    if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + `detected leap name='${name}'`)

    const clean = ChatLib.removeFormatting(name)
    let tries = 0
    let task = setInterval(() => {
      const cls = resolveClass(clean)
      tries++

      if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + `resolve attempt ${tries}: -> ${cls}`)

      if (cls) {
        const cmd = `pc I'm leaking in ${cls} (${name})`
        sendLeapCommand(cmd)
        clearInterval(task)
        leapSound()
      }

      if (tries >= 5) clearInterval(task)
    }, 50)

  } catch (e) {
    if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "leap parse error: " + e)
  }
})

// Also detect the teleport confirmation line: "You have teleported to NAME!" and trigger the leap flow
register("chat", (event) => {
  if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "Settings.leapMsg: " + !Settings.leapMsg)
  if (Settings.leapMsg) return
  try {
    let raw = extractTextFromEvent(event)
    if (!raw) return

    if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "parse teleport chat: " + raw)

    // match teleport confirmation (allow trailing text like " (2)")
    let m = raw.match(/You have teleported to (\S+)!/)
    if (!m) return
    let name = m[1]
    if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + `teleport confirmed name='${name}'`)

    const clean = ChatLib.removeFormatting(name)
    let tries = 0
    let task = setInterval(() => {
      const cls = resolveClass(clean)
      tries++
      if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + `resolve attempt ${tries}: -> ${cls}`)
      if (cls) {
        const cmd = `pc I'm leaking in ${cls} (${name})`
        sendLeapCommand(cmd)
        clearInterval(task)
        leapSound()
      }
      if (tries >= 5) clearInterval(task)
    }, 50)

  } catch (e) {
    if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "teleport parse error: " + e)
  }
})

register("step", () => {
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
    if (LEAP_DEBUG && name.length > 0) ChatLib.chat(D_PREFIX + `cached: ${name} -> ${cls}`)
  })
}).setFps(2)

function resolveClass(name) {
  let best = null
  Object.keys(classCache).forEach(n => {
    if (name.startsWith(n) || n.startsWith(name)) {
      if (!best || n.length > best.length) best = n
    }
  })
  return best ? classCache[best] : null
}

register("chat", (name) => {
  if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + "Settings.leapMsg: " + !Settings.leapMsg)
  if (Settings.leapMsg) return

  const clean = ChatLib.removeFormatting(name)

  if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + `chat trigger received name='${name}' clean='${clean}'`)

  let tries = 0
  let task = setInterval(() => {
    const cls = resolveClass(clean)
    tries++

    if (LEAP_DEBUG) ChatLib.chat(D_PREFIX + `resolve attempt ${tries}: -> ${cls}`)

    if (cls) {
      const cmd = `pc I'm leaking in ${cls} (${name})`
      sendLeapCommand(cmd)
      clearInterval(task)
      leapSound()
    }

    if (tries >= 5) clearInterval(task)
  }, 50)
}).setCriteria("You have teleported to ${name}!")

// Toggleable debug command
register("command", () => {
  if (LEAP_DEBUG) {
    LEAP_DEBUG = false
    ChatLib.chat("§c[67-Addons] leap debug OFF")
    
  } else if (!LEAP_DEBUG) {
    LEAP_DEBUG = true
    ChatLib.chat("§a[67-Addons] leap debug ON")
  } else {
    ChatLib.chat("§e[67-Addons] leap debug ON")
  }
}).setName("leapdebug", true)

// import Settings from "../config"

// const classCache = {}

// register("step", () => {
//   Scoreboard.getLines().forEach(line => {
//     let text = ChatLib.removeFormatting(line.getName())
//       .replace(/[^A-z0-9 \[\]]/g, "")

//     let cls = null

//     if (text.startsWith("[M]")) cls = "Mage"
//     else if (text.startsWith("[A]")) cls = "Archer"
//     else if (text.startsWith("[B]")) cls = "Bers"
//     else if (text.startsWith("[H]")) cls = "Healer"
//     else if (text.startsWith("[T]")) cls = "Tank"

//     if (!cls) return

//     let name = text.replace(/\[.\]\s*/, "").trim()
//     if (name.length > 0) classCache[name] = cls
//   })
// }).setFps(2)

// function resolveClass(name) {
//   let best = null
//   Object.keys(classCache).forEach(n => {
//     if (name.startsWith(n) || n.startsWith(name)) {
//       if (!best || n.length > best.length) best = n
//     }
//   })
//   return best ? classCache[best] : null
// }

// register("chat", (name) => {
//   if (Settings.leapMsg) return

//   const clean = ChatLib.removeFormatting(name)

//   let tries = 0
//   let task = setInterval(() => {
//     const cls = resolveClass(clean)
//     tries++

//     if (cls) {
//       ChatLib.command(`pc I'm leaping to my ${cls} (${name})`)
//       clearInterval(task)
//     }

//     if (tries >= 5) clearInterval(task)
//   }, 50)
// }).setCriteria("You have teleported to ${name}!")