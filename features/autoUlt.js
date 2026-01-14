import Settings from "../config"
import { getClass, PlayerUtils, registerWhen } from "../util/util" 


const UltMessages = [
    {
        msg: "⚠ Maxor is enraged! ⚠", 
        classes: "healer, tank"
    }, // m7

    {
        msg: `[BOSS] Goldor: You have done it, you destroyed the factory…`, 
        classes: "healer, tank"
    }, // m7

    {
        msg: `[BOSS] Livid: I respect you for making it to here, but I'll be your undoing.`, 
        classes: "healer, tank"
    }, // m5

    {
        msg: `[BOSS] Sadan: My giants! Unleashed!`, 
        classes: "healer, tank, archer, berserk, mage"
    }, // m6
]



registerWhen(register(`chat`, (e) => {
    let ChatMsg = ChatLib.getChatMessage(e)
    let PlayerClass = getClass(Player?.getName())?.toLowerCase()?.removeFormatting()
    
    UltMessages.forEach(obj => {
        if (obj.classes.includes(PlayerClass) && obj.msg == ChatMsg) {
            PlayerUtils.UseDungeonClassAbility(true)
        }
    })

}), () => Settings().AutoULT)