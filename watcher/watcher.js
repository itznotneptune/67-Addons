/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

//Taking shit from bloom because chances are you
//already have it installed

import Dungeon from "../../BloomCore/dungeons/Dungeon"
import { waData } from "./util"
import { entryMessages } from "../../BloomCore/utils/Utils"
import settings from "./settings"
const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")  //Thanks azoo

//Wall of shit that doesn't really need to be defined here but oh well

let hasEnteredBlood = false //Has blood been opened
let bloodStartTime = 0  //Start of blood
let bloodSpeakTime = 0  //Time of message
let dialogueTime = 0    //Difference in times
let premoveX = 0  //Saving X coords of watcher
let premoveZ = 0  //Saving Z coords of watcher
let coordChecking = false //Variable to toggle constant coord checking
let firstCoords = false //Allows a one time coord check
var watcherMoved = false  //Stores if the watcher has moved
var watcherCanMoveTime = 0  //The time the watcher can first move at for skip
var bloodFinished = false //Stores if blood is completed or not
var watcherMoveTime = 0 //Saves the time the watcher moved at
var guessingMove = false
var campTime = 0 //Total time taken to finish blood
var playOnce = false
var ticks = 0
var otherticks = 0 //Apparently it doesnt like me using the normal ticks every time 
var dialogueTicks = 0
var moveTicks = 0
var campTicks = 0
var inBoss = false
var guessedMove = 0
var guessedMoveSecs = 0
var hasSaidDialogue = false

var wasOpen = false //Thing for the weird GUI mover

//Resetting variables on world change
//Stop judging my code im sorry ok

register("worldLoad", () => {
  hasEnteredBlood = false
  bloodStartTime = 0
  bloodSpeakTime = 0
  dialogueTime = 0
  premoveX = 0
  premoveZ = 0
  watcherMoved = false
  firstCoords = false
  watcherCanMoveTime = 0
  coordChecking = false
  bloodFinished = false
  watcherMoveTime = 0
  guessingMove = false
  campTime = 0
  playOnce = false
  ticks = 0
  otherticks = 0
  dialogueTicks = 0
  moveTicks = 0
  campTicks = 0
  inBoss = false
  guessedMove = 0
  guessedMoveSecs = 0
  hasSaidDialogue = false
})

//Detecting the chat messages for different blood events, as well as
//displaying the relevant messages to the player.
register("chat", (event) => {
  if(!settings.waToggle) return;

  if(ChatLib.getChatMessage(event,false).startsWith("[BOSS]") && Dungeon.inDungeon){
    if(settings.hideCampInBoss){
      entryMessages.forEach(msg => {
        if(msg == ChatLib.getChatMessage(event,false)){
          inBoss = true
        }
      })
    }
    if(settings.bossMsg){
        cancel(event)
    }
}
  //Blood start
  if(ChatLib.getChatMessage(event,false).startsWith("[BOSS] The Watcher:") && !hasEnteredBlood){
    hasEnteredBlood = true
    bloodStartTime = Date.now()
  }
  //Watcher dialogue that signals when you can prepare to kill blood mobs
  if(ChatLib.getChatMessage(event,false).startsWith("[BOSS] The Watcher: Let's see how you can handle this.")){
    bloodSpeakTime = Date.now()
    dialogueTime = (bloodSpeakTime - bloodStartTime) / 1000
    dialogueTicks = ticks
    watcherCanMoveTime = dialogueTime + parseFloat(2.5)
    //Fast Camp
    if(dialogueTime < parseFloat(22)){
        if(settings.chatInfo){ChatLib.chat(`§6§l[§3WA§6§l]§r §bWatcher took §d§l${dialogueTime.toFixed(1)}s§r§b to reach dialogue!`)}
        guessedMove = bloodStartTime + 24000
        guessedMoveSecs = 24
        if(settings.dialogueNotif){
          if(!settings.babyMode){World.playSound("mob.wolf.bark", 10, 1)}
          if(!settings.babyMode){Client.showTitle(`§4§lFAST WATCHER`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)} //Sent twice because its buggy apparently
          if(!settings.babyMode){Client.showTitle(`§4§lFAST WATCHER`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)}
          if(!settings.babyMode){hasSaidDialogue = true}
        }
    //Average camp
    }else if(dialogueTime >= parseFloat(22) && dialogueTime < parseFloat(25)){
        if(settings.chatInfo){ChatLib.chat(`§6§l[§3WA§6§l]§r §bWatcher took §d§l${dialogueTime.toFixed(1)}s§r§b to reach dialogue!`)}
        guessedMove = bloodStartTime + 28000
        guessedMoveSecs = 28
        if(settings.dialogueNotif){
          if(!settings.babyMode){World.playSound("mob.cat.meow", 10, 1)}
          if(!settings.babyMode){Client.showTitle(`§cWatcher Ready`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)}
          if(!settings.babyMode){Client.showTitle(`§cWatcher Ready`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)}
          if(!settings.babyMode){hasSaidDialogue = true}
        }
    //Slow camp
    }else if(dialogueTime >= parseFloat(25)){
        if(settings.chatInfo){ChatLib.chat(`§6§l[§3WA§6§l]§r §bWatcher took §d§l${dialogueTime.toFixed(1)}s§r§b to reach dialogue!`)}
        guessedMove = bloodStartTime + 30000
        guessedMoveSecs = 30
        if(settings.dialogueNotif){
          if(!settings.babyMode){World.playSound("mob.wither.shoot", 10, 1)}
          if(!settings.babyMode){Client.showTitle(`§8Slow Watcher zz`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)}
          if(!settings.babyMode){Client.showTitle(`§8Slow Watcher zz`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)}
          if(!settings.babyMode){hasSaidDialogue = true}
        }
    }
  }
  
  //Tries to guess when the watcher has moved if the entity used for coord checks is not loaded
  //Uses the dialogue time to guess the move time, but will not always be accurate in some edge cases.
  if(ChatLib.getChatMessage(event,false).startsWith("[BOSS] The Watcher:") && bloodSpeakTime != 0 && !watcherMoved){
      if(((Date.now() - bloodStartTime) / 1000).toFixed(1) >= 40){
        if(settings.chatInfo){ChatLib.chat(`§6§l[§3WA§6§l]§r §bGuessing Watcher moved at §d§l${guessedMoveSecs}s!§r`)}
        watcherMoveTime = guessedMove
        moveTicks = (guessedMoveSecs*20)
        watcherMoved = true
        guessingMove = true
      }

  }
  //Blood camp breakdown
  if(ChatLib.getChatMessage(event,false).startsWith("[BOSS] The Watcher: You have proven yourself. You may pass.") && bloodStartTime != 0){
    campTicks = ticks
    bloodFinished = true
    campTime = ((Date.now() - bloodStartTime) / 1000).toFixed(2)
    if(!settings.chatInfo) return;
    if(!guessingMove){
      if(settings.chatInfoStyle == 0){
        ChatLib.chat(`§6§l[§3WA§6§l]§r §bBlood camp took §d§l${((Date.now() - bloodStartTime) / 1000).toFixed(1)}s§r §7(${((campTicks) / 20).toFixed(1)})§b!`)
      }else if(settings.chatInfoStyle == 1){
        ChatLib.chat(`§6§l[§3WA§6§l]§r §bPost move camp took §d§l${((Date.now() - watcherMoveTime) / 1000).toFixed(1)}s§r §7(${((campTicks - moveTicks) / 20).toFixed(1)})§b!`)
      }else if(settings.chatInfoStyle == 2){
        ChatLib.chat(`§6§l[§3WA§6§l]§r §bBlood camp breakdown: §d${((Date.now() - bloodStartTime) / 1000).toFixed(1)}s§r §7(${((campTicks) / 20).toFixed(1)})§r§6§l / §d${((Date.now() - watcherMoveTime) / 1000).toFixed(1)}s§r §7(${((campTicks - moveTicks) / 20).toFixed(1)})§b!`)
      }
    }else{
      if(settings.chatInfoStyle == 0){
        ChatLib.chat(`§6§l[§3WA§6§l]§r §bBlood camp took §d§l${((Date.now() - bloodStartTime) / 1000).toFixed(1)}s§r §7(${((campTicks) / 20).toFixed(1)})§b!`)
      }else if(settings.chatInfoStyle == 1){
        ChatLib.chat(`§6§l[§3WA§6§l]§r §bGuessing post move camp took §d§l${(guessedMoveSecs)}s§r §7(${(guessedMove)})§b!`)
      }else if(settings.chatInfoStyle == 2){
        ChatLib.chat(`§6§l[§3WA§6§l]§r §bBlood camp breakdown: §d${((Date.now() - bloodStartTime) / 1000).toFixed(1)}s§r §7(${((campTicks) / 20).toFixed(1)})§r§6§l / §c§o${((Date.now() - guessedMove) / 1000).toFixed(1)}s§r §7(${((campTicks - moveTicks) / 20).toFixed(1)})§b!`)
      }
    }
  }
})

//Stuff for easy mode yawn 
register("step", () => {
  if(!settings.waToggle || !Dungeon.inDungeon) return;
  if(hasSaidDialogue) return;
  if(settings.babyMode && settings.dialogueNotif && bloodSpeakTime != 0 &&((Date.now() - bloodSpeakTime) / 1000) >= 1.5){
      if(guessedMoveSecs == 24){
          World.playSound("mob.wolf.bark", 10, 1)
          Client.showTitle(`§4§lFAST WATCHER`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)
          Client.showTitle(`§4§lFAST WATCHER`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)
      }else if(guessedMoveSecs == 28){
          World.playSound("mob.cat.meow", 10, 1)
          Client.showTitle(`§cWatcher Ready`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)
          Client.showTitle(`§cWatcher Ready`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)
      }else if(guessedMoveSecs == 30){
          World.playSound("mob.wither.shoot", 10, 1)
          Client.showTitle(`§8Slow Watcher zz`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)
          Client.showTitle(`§8Slow Watcher zz`, `§bTook §d${dialogueTime.toFixed(1)}s§b!`, 2, 45, 10)
      }
      hasSaidDialogue = true
  }
}).setFps(5)

//Detecting when the watcher moves
//Still sometimes bugs out and displays a very early move time, however I cannot seem to
//recreate this bug while testing, so for now it just has to remain

register("renderEntity", (entity, position, ticks, event) => {
    if (!settings.waToggle || !Dungeon.inDungeon) return;
    let mcEntity = entity.entity
  
    if (mcEntity instanceof EntityArmorStand && !bloodFinished) {
      if (entity.getName().includes("The Watcher") && bloodSpeakTime != 0){ //If the entity is called The Watcher and he said the dialogue:
        if(!firstCoords && ((Date.now() - bloodStartTime) / 1000) >= parseFloat(watcherCanMoveTime)){ //means we only take first coord snapshot after the time he should be able to move
            firstTime = Date.now()
            premoveX = entity.getX()  //Grabs the X and Z coords for the watcher entity
            premoveZ = entity.getZ()
            coordChecking = true
            firstCoords = true
        }
        //This part only runs AFTER we have coords to check against AND the watcher should be able to move
        if(coordChecking && !watcherMoved){
          if(((Date.now() - bloodStartTime) / 1000) < 24) return
          if(parseFloat(premoveX).toFixed(1) != parseFloat(entity.getX()).toFixed(1) || parseFloat(premoveZ).toFixed(1) != parseFloat(entity.getZ()).toFixed(1)){
            watcherMoveTime = Date.now()
            moveTicks = otherticks
            if(settings.chatInfo){ChatLib.chat(`§6§l[§3WA§6§l]§r §bWatcher moved at §d§l${((Date.now() - bloodStartTime) / 1000).toFixed(1)}s§r §7(${(moveTicks / 20).toFixed(1)})§b!`)}
            coordChecking = false
            watcherMoved = true
            }
        }
      }
    }
})

//Camp Stats overlay:
//Surely its not THAT lag inducing right
//IM WORKING ON IT AZOO OK
register("renderOverlay", () => {
  if(!settings.waToggle) return;
  if(settings.hideCampInBoss && inBoss) return;
  if(Dungeon.inDungeon && settings.campInfo) {
      //Title
      Renderer.scale(waData.campScale,waData.campScale)
      Renderer.drawString(`&c&lWatcher Stats&r:`,waData.campX,waData.campY)
      //Dialogue time
      if(bloodStartTime == 0){
        Renderer.scale(waData.campScale,waData.campScale)
        Renderer.drawString(`&dDialogue&r: 0s`,waData.campX,waData.campY+(10*waData.campScale))
      }else if(bloodStartTime != 0 && bloodSpeakTime == 0){
        Renderer.scale(waData.campScale,waData.campScale)
        Renderer.drawString(`&dDialogue&r: ${((Date.now() - bloodStartTime) / 1000).toFixed(2)}s &7(${(ticks / 20).toFixed(1)})`,waData.campX,waData.campY+(10*waData.campScale))
      }else{
        Renderer.scale(waData.campScale,waData.campScale)
        Renderer.drawString(`&dDialogue&r: ${dialogueTime}s &7(${(dialogueTicks / 20).toFixed(1)})`,waData.campX,waData.campY+(10*waData.campScale))
      }
      //Move time
      if(!watcherMoved){
        Renderer.scale(waData.campScale,waData.campScale)
        Renderer.drawString(`&dWatcher Move&r: Not Moved!`,waData.campX,waData.campY+(20*waData.campScale))
      }else{
        Renderer.scale(waData.campScale,waData.campScale)
        Renderer.drawString(`&dWatcher Move&r: ${((watcherMoveTime - bloodStartTime) / 1000).toFixed(2)}s &7(${(moveTicks / 20).toFixed(1)})`,waData.campX,waData.campY+(20*waData.campScale))
      }
      //Camp time
      if(!hasEnteredBlood){
        Renderer.scale(waData.campScale,waData.campScale)
        Renderer.drawString(`&dCamp&r: Not Started!`,waData.campX,waData.campY+(30*waData.campScale))
      }else if(hasEnteredBlood && !bloodFinished){
        Renderer.scale(waData.campScale,waData.campScale)
        Renderer.drawString(`&dCamp&r: ${((Date.now() - bloodStartTime) / 1000).toFixed(2)}s &7(${(ticks / 20).toFixed(1)})`,waData.campX,waData.campY+(30*waData.campScale))
      }else{
        Renderer.scale(waData.campScale,waData.campScale)
        Renderer.drawString(`&dCamp&r: ${campTime}s &7(${(campTicks / 20).toFixed(1)})`,waData.campX,waData.campY+(30*waData.campScale))
      }
  }
})

//Packet-y stuff for more accurate times (thanks azoo again)
register('packetReceived', () => {
  if(hasEnteredBlood){
    ticks++
    otherticks++
  }
}).setFilteredClass(S32PacketConfirmTransaction)

//Total nonsense section dedicated to my fight against PogData
//and moving elements in a HUD

register("dragged", (dx, dy, x, y,left) => {
  if(settings.campGui.isOpen()) {
      waData.campX = x,
      waData.campY = y
  }
})

//Renders a new string when the move gui is open
register("renderOverlay", () => {
  if (!settings.campGui.isOpen()) return
  Renderer.scale(1,1)
  Renderer.drawString(`&c&lWatcher Stats&r:`,waData.campX,waData.campY)
})

//Stuff to help save the data do NOT worry about it
function wasMoveGUIOpen(){
  if(settings.campGui.isOpen() && wasOpen == false){
      wasOpen = true
  }
  if(!settings.campGui.isOpen() && wasOpen == true){
      waData.save()
      wasOpen = false
  }
}

register("step", () => {
  wasMoveGUIOpen()
}).setFps(1)
