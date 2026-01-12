register("chat", () => {
    new Sound({source: "mage677.ogg"})?.play();
}).setCriteria("Mage677 joined your party")

register("chat", () => {
    new Sound({source: "mage677.ogg"})?.play();
    ChatLib.chat("§6[67Addons] §aThe goat has joined your party");
}).setCriteria("Mage677 joined the dungeon group!").setContains();