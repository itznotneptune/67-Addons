import Settings from "../config.js"

// --------------------------------- Variables --------------------------------- \\

let deathTickStart = null
let deathTickEnd = null
let deathTickActive = false
let deathTickDuration = 0
let text = new Text('').setScale(2).setShadow(true).setAlign('CENTER').setColor(Renderer.RED)

// --------------------------------- Death Tick Detection --------------------------------- \\

register("chat", () => {
    if (!Settings.deathTickTimer) return
    deathTickDuration = 40 // 20 ticks = 1 second
    
}).setCriteria(/^(\S+) is no long ready!$/)