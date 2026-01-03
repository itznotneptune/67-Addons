import Settings from "./configs";

import "./features/BloodRushSplit"
import "./features/QueueDungeonCommand"
// import "./features/RapidFire"
// import "./features/ExplosiveShot"
import "./features/RelicUtils"
// import "./features/HideLeap"
import "./features/Relic"
import "./features/AutoRefill"
import "./features/ScoreMessage"
import "./features/Crypt"
import "./features/CoreMessage"
import "./features/rag"
// import "./features/automask"
// import "./features/playerSize.js"
import "./features/leapMsg"
import "./features/placeCrystal"
// import "./features/deathTickTimer"
// import "./m4Features/mobDisplay"
// import "./m4Features/m4Render"
import "./features/termCounter"
import "./features/bloodDone"
import "./watcher/settings"
import "./watcher/index"

// restore simple command for opening GUI
register("command", (...args) => {
    Settings.openGUI()
}).setName("67").setAliases("67addons", "67-addons", "67addon");