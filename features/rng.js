import Settings from "../config"

register("chat", () => {
    if (!Settings.rngSound) return
    new Sound({source: "levelup.ogg"}).setVolume(0.1)?.play();
}).setCriteria("SKILL LEVEL UP").setContains()

register("chat", () => {
    if (!Settings.rngSound) return
    new Sound({source: "levelup.ogg"}).setVolume(0.1)?.play();
}).setCriteria("LVL UP!").setContains()

// insane rng drop
register("chat", () => {
    if (!Settings.rngSound) return
    new Sound({source: "rng.ogg"}).setVolume(0.2)?.play();
}).setCriteria("INSANE DROP!").setContains()

// rng drop
register("chat", () => {
    if (!Settings.rngSound) return
    new Sound({source: "rng.ogg"}).setVolume(0.2)?.play();
}).setCriteria("CRAZY RARE DROP!").setContains()