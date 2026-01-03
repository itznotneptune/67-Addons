import config from "../config"
register("chat", () => {
    if (config.ragcancel) ChatLib.command("pc I got touched and now I can't rag :(");
}).setCriteria("Ragnarock was cancelled due to taking damage!")