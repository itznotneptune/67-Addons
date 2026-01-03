//Importing features
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
//Importing gui
import Settings from "./config";
//gui command
register("command", function() { Settings.openGUI(); }).setName("67");
