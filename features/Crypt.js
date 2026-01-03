import Dungeon from "../../BloomCore/dungeons/Dungeon";
import config from "../config";

let sent = false;

register("step", () => {
    if (config.Crypt) return;
    if (!Dungeon.inDungeon) return;
    if (sent) return;

    const crypts = Dungeon.crypts;
    if (crypts >= 5) {
        ChatLib.command(`pc 5/5 crypts killed at ${Dungeon.time}!`);
        sent = true;
    }
}).setFps(1);

register("worldUnload", () => {
    sent = false;
});