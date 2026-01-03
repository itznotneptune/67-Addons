// first boss msg [BOSS] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!

// --------------------------------- Imports --------------------------------- \\

import config from "../config.js"

// --------------------------------- Stuff ---------------------------------- \\

const text_scale = 1;
let Bats = 0;
let Cows = 0;
let Chickens = 0;
let Rabbits = 0;
let Sheep = 0;
let Wolves = 0;

let total = 0;

let deadBats = 0;
let deadCows = 0;
let deadChickens = 0;
let deadRabbits = 0;
let deadSheep = 0;
let deadWolves = 0;

const animalsMap = {
    "spirit bat": "deadBats",
    "spirit bull": "deadCows",
    "spirit wolf": "deadWolves",
    "spirit rabbit": "deadRabbits",
    "spirit sheep": "deadSheep",
    "spirit chicken": "deadChickens"
};
const animalsRegex = new RegExp(Object.keys(animalsMap).join("|"), "i");

// --------------------------------- Mob Detection ---------------------------------- \\

register("packetReceived", (event) => {
    if(config.m4MobsDisplay) {return}
    deadBats = 0;
    deadCows = 0;
    deadChickens = 0;
    deadRabbits = 0;
    deadSheep = 0;
    deadWolves = 0;

    try {
        const entities = World.getAllEntities();
        for (let i = 0; i < entities.length; i++) {
            let name = entities[i].getName().toLowerCase();
            if (!name) continue;
            name = name.replace(/§/g, "$");
            if (!name.endsWith("$e0$c❤")) continue;
            
            const match = name.match(animalsRegex);
            if (match) {
                const key = animalsMap[match[0].toLowerCase()];
                switch (key) {
                    case "deadBats": deadBats++; break;
                    case "deadCows": deadCows++; break;
                    case "deadWolves": deadWolves++; break;
                    case "deadRabbits": deadRabbits++; break;
                    case "deadSheep": deadSheep++; break;
                    case "deadChickens": deadChickens++; break;
                }
            }
        }

        Bats = World.getAllEntities().filter(e => e.getClassName() === "EntityBat").length - deadBats;
        Cows = World.getAllEntities().filter(e => e.getClassName() === "EntityCow").length - deadCows;
        Chickens = World.getAllEntities().filter(e => e.getClassName() === "EntityChicken").length - deadChickens;
        Rabbits = World.getAllEntities().filter(e => e.getClassName() === "EntityRabbit").length - deadRabbits;
        Sheep = World.getAllEntities().filter(e => e.getClassName() === "EntitySheep").length - deadSheep;
        Wolves = World.getAllEntities().filter(e => e.getClassName() === "EntityWolf").length - deadWolves;

        total = Bats + Cows + Chickens + Rabbits + Sheep + Wolves;
    } catch (e) {
        ChatLib.chat(e);
    }
}).setPacketClass(net.minecraft.network.play.server.S32PacketConfirmTransaction);

// --------------------------------- Overlay Renderer ---------------------------------- \\

register("renderOverlay", () => {
    if (config.m4MobsDisplay) {return}
    if (total === 0) {return}
    // let x = Renderer.screen.getWidth() / 2 / text_scale - 50;
    let x = 225;
    let y = Renderer.screen.getHeight() / 2 / text_scale - 250;

    Renderer.scale(text_scale);

    Renderer.drawString(`§c§lTotal: ${total.toString()}`, x, y - 15, true);
    Renderer.drawString(`${Bats.toString()} Bats`, x, y + 0, true);
    Renderer.drawString(`${Cows.toString()} Cows`, x, y + 10, true);
    Renderer.drawString(`${Chickens.toString()} Chickens`, x, y + 20, true);
    Renderer.drawString(`${Rabbits.toString()} Rabbits`, x, y + 30, true);
    Renderer.drawString(`${Sheep.toString()} Sheep`, x, y + 40, true);
    Renderer.drawString(`${Wolves.toString()} Wolves`, x, y + 50, true);

    Renderer.scale(1);
});


// --------------------------------- Debug Commands ---------------------------------- \\

register("command", () => {
    ChatLib.chat(`Bats: ${Bats}, Cows: ${Cows}, Chickens: ${Chickens}, Rabbits: ${Rabbits}, Sheep: ${Sheep}, Wolves: ${Wolves}, Total: ${total}`);

}).setName("m4mobs");

register("command", () => {
    total = 0;
    Bats = 0;
    Cows = 0;
    Chickens = 0;
    Rabbits = 0;
    Sheep = 0;
    Wolves = 0;
}).setName("m4reset");

register("command", (mob, amount) => {
    if (mob == null) {
        ChatLib.chat("Please specify a mob type: bats, cows, chickens, rabbits, sheep, wolves");
        return;
    } else if (mob === "bats") {
        Bats += parseInt(amount);
    } else if (mob === "cows") {
        Cows += parseInt(amount);
    } else if (mob === "chickens") {
        Chickens += parseInt(amount);
    } else if (mob === "rabbits") {
        Rabbits += parseInt(amount);
    } else if (mob === "sheep") {
        Sheep += parseInt(amount);
    } else if (mob === "wolves") {
        Wolves += parseInt(amount);
    }
    total = Bats + Cows + Chickens + Rabbits + Sheep + Wolves;
}).setName("m4add");

// --------------------------------- End of Code ---------------------------------- \\