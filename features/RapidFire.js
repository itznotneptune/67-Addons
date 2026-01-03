import Settings from "../config"
register("chat", () => {
    if (Settings.rapid) ChatLib.command("pc Used Rapid Fire!");
}).setCriteria("Used Rapid Fire!")
