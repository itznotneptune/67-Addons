import { getScoreboard, removeUnicode } from "../../BloomCore/utils/Utils"
import PogObject from "../../PogData";
// import Font from '../../../modules/FontLib'

export const prefix = "&b[&f67&b]"

export function getDistance(x1, z1, x2, z2) {
    return Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2)
}

export function formatNumber(number) {
    let format = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let ind = format.indexOf(".")
    if (ind > -1) return format.substring(0, ind)
    else return format
}

export function isInDungeon() {
    try {
        return TabList?.getNames()?.some(a => a.removeFormatting() == 'Dungeon: Catacombs')
    } catch (e) { }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isInKuudra() {
    try {
        return TabList?.getNames()?.some(a => a.removeFormatting() == 'Area: Kuudra')
    } catch (e) { }
}

export function getClass() {
    let index = TabList?.getNames()?.findIndex(line => line?.includes(Player.getName()))
    if (index == -1) return
    let match = TabList?.getNames()[index]?.removeFormatting().match(/.+ \((.+) .+\)/)
    if (!match) return "EMPTY"
    return match[1];
}

export const rooms = JSON.parse(FileLib.read("67-Addons", "util/roomdata.json"))

export const getRoomID = () => {
    let sb = getScoreboard(false)
    if (!sb) return null
    let line = removeUnicode(sb[sb.length-1])
    let match = line.match(/\d+\/\d+\/\d+ \w+ ([-\d]+,[-\d]+)/)
    if (!match) return null
    return match[1]
}

export const getRoom = (roomID=null) => {
    if (roomID == null) roomID = getRoomID()
    return rooms?.find(a => a.id.includes(roomID)) ?? null
}

export const inSkyblock = () => {
    if (Scoreboard.getTitle().removeFormatting().includes("SKYBLOCK")) return true
    return false
}

export const S2APacketParticles = Java.type('net.minecraft.network.play.server.S2APacketParticles')

const messageColors = { info: `&e`, success: `&a`, error: `&c`, warning: `&6` };

export const showChatMessage = (message, status = "info") => { 
  const color = messageColors[status] || messageColors.info;
  ChatLib.chat(`${PREFIX} ${color}${message}`);
}

const registers = [];

export const registerWhen = (trigger, dependency) => {
  registers.push({
    controller: trigger.unregister(),
    dependency,
    registered: false,
  });
};

export class PlayerUtils {
  

  /**
   * Returns the player's eye position.
   *
   * @returns {Object} An object containing the x, y, and z coordinates of the player's eye position.
   */
  static getEyePos() {
    if (!Player) return
    return {
      x: Player.getX(),
      y: Player.getY() + Player.getPlayer().func_70047_e(),
      z: Player.getZ()
    }
  }


  /**
   * Rotates the player's view in the game world.
   *
   * @param {number} yaw - The new yaw (horizontal rotation) value for the player's view.
   * @param {number} pitch - The new pitch (vertical rotation) value for the player's view.
   *
   */
  static rotate(yaw, pitch) {
    const player = Player.getPlayer()
    player.field_70177_z = yaw
    player.field_70125_A = pitch
  }


  /**
   * Calculates the yaw and pitch angles required to look at a specific block position.
   *
   * @param {Object} BlockPos - The block position object containing the x, y, and z coordinates.
   * @param {Object} [PlayerPos] - The player position object containing the x, y, and z coordinates. If not provided, the player's eye position will be used.
   *
   * @returns {Array} An array containing the yaw and pitch angles in degrees. If the calculation fails, returns undefined.
   */
  static calcYawPitch(BlockPos, PlayerPos) {
    if (!PlayerPos) PlayerPos = this.getEyePos()

    let d = {
        x: BlockPos.x - PlayerPos.x,
        y: BlockPos.y - PlayerPos.y,
        z: BlockPos.z - PlayerPos.z
    }

    let yaw = 0;
    let pitch = 0;

    if (d.x != 0) {

        if (d.x < 0) yaw = 1.5 * Math.PI
        else {yaw = 0.5 * Math.PI}

        yaw = yaw - Math.atan(d.z / d.x);
    }
    else if (d.z < 0) yaw = Math.PI;

    d.xz = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.z, 2))
    pitch = -Math.atan(d.y / d.xz)
    yaw = -yaw * 180 / Math.PI
    pitch = pitch * 180 / Math.PI
    if (pitch < -90 || pitch > 90 || isNaN(yaw) || isNaN(pitch) || yaw == null || pitch == null || yaw == undefined || pitch == null) return

    return [yaw, pitch]
  
  }


  /**
   * Rotates the player's view in the game world smoothly over a specified time period.
   *
   * @param {number} yaw - The new yaw (horizontal rotation) value for the player's view.
   * @param {number} pitch - The new pitch (vertical rotation) value for the player's view.
   * @param {number} time - The duration in milliseconds over which the rotation should occur.
   */
  static rotateSmoothly(yaw, pitch, time, canselCheck = false) {
    while (yaw >= 180) yaw -= 360
    while (yaw < -180) yaw += 360

    const initialYaw = Player.getYaw()
    const initialPitch = Player.getPitch()

    const initialTime = new Date().getTime()

    const trigger = register("step", () => {
      if (canselCheck) trigger.unregister()
        
      const progress = time <= 0 ? 1 : Math.max(Math.min((new Date().getTime() - initialTime) / time, 1), 0)

      const amount = (1 - progress) * (1 - progress) * (1 - progress) * 0 + 3 * (1 - progress) * (1 - progress) * progress * 1 + 3 * (1 - progress) * progress * progress * 1 + progress * progress * progress * 1

      this.rotate(initialYaw + (yaw - initialYaw) * amount, initialPitch + (pitch - initialPitch) * amount)

      if (progress >= 1) trigger.unregister()
    })
  }


  /**
   * Swaps the player's inventory to the item in the specified slot.
   *
   * @param {number} SlotIndex - The index of the slot to swap to.
   *
   * @returns {void}
   */
  static swapToSlot(SlotIndex) {
    const MCplayer = Player.getPlayer()

    if (!MCplayer || (SlotIndex < 0 || SlotIndex > 8)) return ModMessage("&cCannot swap to " + SlotIndex + "&c. Not in hotbar.")
      
    const MCInventory = MCplayer.field_71071_by
    if (!MCInventory) return

    MCInventory.field_70461_c = SlotIndex

    ModMessage(`Swapped to ${Player?.getInventory()?.getStackInSlot(SlotIndex)?.getName()}&r in slot &6${SlotIndex}`)
  }


  /**
   * Simulates a mouse click event in the game world.
   *
   * @param {string} [Type="LEFT"] - The type of mouse click. Can be "LEFT", "RIGHT", or "MIDDLE". Defaults to "LEFT".
   */
  static Click(Type = "LEFT") {
    Type = Type.removeFormatting().toLocaleLowerCase()
    const MC = Client.getMinecraft()

    if (Type === "left") {
      const LeftClickMethod = MC.getClass().getDeclaredMethod("func_147116_af", null)
      LeftClickMethod.setAccessible(true)
      LeftClickMethod.invoke(MC, null)
    } 
    
    if (Type === "right") {
      const RightClickMethod = MC.getClass().getDeclaredMethod("func_147121_ag", null)
      RightClickMethod.setAccessible(true)
      RightClickMethod.invoke(MC, null)
    } 

    if (Type === `middle`) {
      const MiddleClickMethod = MC.getClass().getDeclaredMethod("func_147112_ai", null)
      MiddleClickMethod.setAccessible(true)
      MiddleClickMethod.invoke(MC, null)
    } 

  }


  /**
   * Holds a mouse button
   *
   * @param {boolean} Boolan - A boolean indicating whether to Hold or Release.
   * If true, Hold. If false, Release.
   *
   * @param {string} [Type="RIGHT"] - The type of mouse click. Can be "LEFT", "RIGHT", or "MIDDLE".
   * Defaults to "RIGHT".
   */
  static HoldClick(Boolan, Type = "RIGHT") {
    Type = Type.removeFormatting().toLocaleLowerCase()

    if (Type === "right") {
      const RightClickKey = Client.getMinecraft().field_71474_y.field_74313_G
      RightClickKey.func_74510_a(RightClickKey.func_151463_i(), Boolan)
    } 

    if (Type === "left") {
      const LeftClickKey = Client.getMinecraft().field_71474_y.field_74312_F
      LeftClickKey.func_74510_a(LeftClickKey.func_151463_i(), Boolan)
    }
    
    if (Type === `middle`) {
      const MiddleClickKey = Client.getMinecraft().field_71474_y.field_74322_I
      MiddleClickKey.func_74510_a(MiddleClickKey.func_151463_i(), Boolan)
    } 

  }


  /**
   * This function is used to use the ability of the dungeon class.
   *
   * @param {boolean} [Ultimate=false] - A boolean indicating whether to use the ultimate or the ability.
   * If true, the ultimate ability will used. If false, the class ability will used.
   * The default value is false, meaning the ability will be used.
   *
   * @example
   * PlayerUtils.UseDungeonClassAbility(true); // use the ultimate ability
   * PlayerUtils.UseDungeonClassAbility(false); // use the class ability
   */
  static UseDungeonClassAbility(Ultimate = false) {
      Ultimate = !Ultimate
      const MCplayer = Player.getPlayer()
      if (!MCplayer) throw new Error("Player object does not exist.")

      MCplayer.func_71040_bB(Ultimate)
  }


  /**
   * Toggles the sneak state of the player.
   *
   * @param {boolean} Boolan - A boolean indicating whether to enable or disable sneaking.
   * If true, sneaking will be enabled. If false, sneaking will be disabled.
   */
  static Sneak(Boolan) {
    const sneakKey = new KeyBind(Client.getMinecraft().field_71474_y.field_74311_E);
    sneakKey.setState(Boolan);
  }

}