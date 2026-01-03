import Settings from "../config";
import { Player, Inventory, register } from "../util/util"; // Adjust import if needed

function equipMask(maskName) {
    let inv = Player.getInventory();
    for (let i = 0; i < inv.getSize(); i++) {
        let item = inv.getItem(i);
        if (item && item.getName().includes(maskName)) {
            Inventory.moveItem(i, 5); // 5 is usually the helmet slot
            ChatLib.chat(`Equipped ${maskName}!`);
            return true;
        }
    }
    ChatLib.chat(`Mask "${maskName}" not found in inventory.`);
    return false;
}

// Automatically equip mask based on health
register("tick", () => {
    const healthPercent = (Player.getHP() / Player.getMaxHP()) * 100;
    if (healthPercent < 40) { // Set your threshold
        // Try to equip Bonzo's Mask first, then Spirit Mask
        if (!equipMask("Bonzo's Mask")) {
            equipMask("Spirit Mask");
        }
    }
});

register("chat", () => {
    if (Settings.automask) {
        if (!equipMask("Bonzo's Mask")) {
            equipMask("Spirit Mask");
        }
    }
}).setCriteria("Sigma")