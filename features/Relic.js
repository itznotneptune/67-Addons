import { getClass } from "../util/util"
import Settings from "../configs"

// Archer
register("chat", () => {
    if (Settings.Relic || getClass() !== "Archer") return;
    ChatLib.command("pc Archer --> Red Relic");
}).setCriteria("[BOSS] Necron: All this, for nothing...");

// Berserk
register("chat", () => {
    if (Settings.Relic || getClass() !== "Berserk") return;
    ChatLib.command("pc Bers --> Orange Relic");
}).setCriteria("[BOSS] Necron: All this, for nothing...");

// Healer
register("chat", () => {
    if (Settings.Relic || getClass() !== "Healer") return;
    ChatLib.command("pc Healer --> Purple Relic");
}).setCriteria("[BOSS] Necron: All this, for nothing...");

// Mage
register("chat", () => {
    if (Settings.Relic || getClass() !== "Mage") return;
    ChatLib.command("pc Mage --> Blue Relic");
}).setCriteria("[BOSS] Necron: All this, for nothing...");

// Tank
register("chat", () => {
    if (Settings.Relic || getClass() !== "Tank") return;
    ChatLib.command("pc Tank --> Green Relic");
}).setCriteria("[BOSS] Necron: All this, for nothing...");

// register("chat", () => {
//     if (Settings.Relic || getClass() !== "Tank") return;
//     ChatLib.command("pc" + getClass() + " --> Green Relic");
//     else if (Settings.Relic || getClass() === "Healer") return;
//     ChatLib.command("pc" + getClass() + " --> Purple Relic");
//     else if (Settings.Relic || getClass() === "Mage") return;
//     ChatLib.command("pc" + getClass() + " --> Blue Relic");
//     else if (Settings.Relic || getClass() === "Berserk") return;
//     ChatLib.command("pc" + getClass() + " --> Orange Relic");
//     else if (Settings.Relic || getClass() === "Archer") return;
//     ChatLib.command("pc" + getClass() + " --> Red Relic");
// }).setCriteria("[BOSS] Necron: All this, for nothing...");