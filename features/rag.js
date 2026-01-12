import Settings from "../config"

// try { ChatLib.chat("[67-Addons] rag.js loaded, Settings.ragcancel=" + Settings.ragcancel) } catch (e) {}

register("chat", () => {
    if (Settings.ragcancel) ChatLib.command("pc I got touched and now I can't rag :(");
}).setCriteria("Ragnarock was cancelled due to taking damage!")