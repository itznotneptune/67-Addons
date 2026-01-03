/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import settings from "./settings"
import { waData } from "./util"
import Dungeon from "../../BloomCore/dungeons/Dungeon"

const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")  //Thanks azoo

var lividStart = 0
var bossTicks = 390 // Have to count down from 19.5 seconds * 20
var wasOpen = false //Thing for the weird GUI mover
var playOnce = false

register("worldLoad", () => {
    lividStart = 0
    bossTicks = 390
    playOnce = false
})

//Packet-y stuff for more accurate times (thanks azoo again)
register('packetReceived', () => {
    if(lividStart != 0){
      bossTicks--
    }
  }).setFilteredClass(S32PacketConfirmTransaction)

register("chat", (event) => {
    //Livid boss fight start
    if(ChatLib.getChatMessage(event,false).startsWith("[BOSS] Livid: Welcome") && Dungeon.inDungeon){
        lividStart = Date.now()
    }
    //I just put the boss message cancel thing here, I mean its gotta go somewhere right
    if(ChatLib.getChatMessage(event,false).startsWith("[BOSS]") && Dungeon.inDungeon){
        if(settings.bossMsg){
            cancel(event)
        }
    }
})

//Livid ice spray / vuln / whatever timer
register("renderOverlay", () => {
    if(!settings.waToggle) return;
    if(!settings.lividTimer || !Dungeon.inDungeon) return;
    if(lividStart != 0){
        let lividVuln = (bossTicks / 20).toFixed(1)
        let killMsg = ((bossTicks + 40) / 20).toFixed(1)
        if(parseFloat(lividVuln) > 0.0){
          Renderer.scale(waData.timerScale,waData.timerScale)
          Renderer.drawString(`&d${lividVuln}s`,waData.timerX,waData.timerY)
        }else if((parseFloat(lividVuln) <= 0.0) && (parseFloat(killMsg) > 0.0)){
          if(!playOnce){
            World.playSound("mob.endermen.hit", 10, 1)
            playOnce = true
          }
          Renderer.scale(waData.timerScale,waData.timerScale)
          Renderer.drawString(`&c&lKILL`,waData.timerX,waData.timerY)
        }
        
      }
})

//Same stuff from watcher.js, maybe I should put this in the utils file :D

register("dragged", (dx, dy, x, y,left) => {
  if(settings.lividGui.isOpen()) {
      waData.timerX = (x / waData.timerScale),
      waData.timerY = (y / waData.timerScale)
  }
})

register("renderOverlay", () => {
  if (!settings.lividGui.isOpen()) return;
  Renderer.scale(3,3)
  Renderer.drawString(`&d19.5s`,waData.timerX,waData.timerY)
})

function wasMoveGUIOpen(){
  if(settings.lividGui.isOpen() && wasOpen == false){
      wasOpen = true
  }
  if(!settings.lividGui.isOpen() && wasOpen == true){
      waData.save()
      wasOpen = false
  }
}

register("step", () => {
  wasMoveGUIOpen()
}).setFps(1)