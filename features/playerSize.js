import config from "../config"
import { prefix } from "../util/util"
import { registerWhen } from "../../BloomCore/utils/Utils"

// Do not declare GL11/mc/rm at module scope to avoid redeclaration errors
const EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")

// set desired visual scale
let scaleX = 1.5
let scaleY = 1.5

register("renderEntity", (entity, pos, partialTicks, event) => {
    try {
        const GL11 = Java.type('org.lwjgl.opengl.GL11')
        const mc = Client.getMinecraft()
        function resolveRenderManager() {
            try {
                let rm = null
                if (mc.getRenderManager && typeof mc.getRenderManager === 'function') rm = mc.getRenderManager()
                if (!rm && mc.renderManager) rm = mc.renderManager
                try { if (!rm) rm = Java.type('net.minecraft.client.renderer.entity.RenderManager').instance } catch (e) {}
                try { if (!rm && Java.type('net.minecraft.client.renderer.entity.RenderManager').getInstance) rm = Java.type('net.minecraft.client.renderer.entity.RenderManager').getInstance } catch (e) {}
                return rm
            } catch (e) { return null }
        }
        const rm = resolveRenderManager()
        // one-time debug log to help identify available render methods
        if (!this.__playerSizeDebugLogged) {
            try {
                ChatLib.chat(`[playerSize] renderManager=${rm ? 'present' : 'null'}, hasRenderEntityStatic=${!!(rm && rm.renderEntityStatic)}, hasRendererMap=${!!((rm && rm.getEntityRendererMap && rm.getEntityRendererMap()) || (rm && rm.entityRenderMap))}`)
            } catch (e) {}
            this.__playerSizeDebugLogged = true
        }
        const ent = entity.getEntity()
        if (!(ent instanceof EntityPlayer)) return
        if (entity.getName() !== Player.getName()) return // only scale yourself

        // determine whether we can manually render (need a render manager or renderer map)
        const rendererMap = (rm && (rm.getEntityRendererMap && rm.getEntityRendererMap())) || (rm && rm.entityRenderMap) || null
        const canManualRender = !!(rm && (rm.renderEntityStatic || rendererMap))
        if (!canManualRender) return // fall back to default rendering
        // cancel default render (we will render manually scaled)
        cancel(event)

        // get world position; pos may be an object or fallback to entity fields
        let px = (typeof pos.x !== "undefined") ? pos.x : ent.field_70165_t
        let py = (typeof pos.y !== "undefined") ? pos.y : ent.field_70163_u
        let pz = (typeof pos.z !== "undefined") ? pos.z : ent.field_70161_v

        GL11.glPushMatrix()

        // compute viewer position from render view entity (works across mappings)
        const view = (mc.getRenderViewEntity && mc.getRenderViewEntity()) || mc.getRenderViewEntity || mc.renderViewEntity || mc.field_71439_g || null
        const vpX = view ? (view.posX || view.field_70165_t || view.getPosX && view.getPosX()) : 0
        const vpY = view ? (view.posY || view.field_70163_u || view.getPosY && view.getPosY()) : 0
        const vpZ = view ? (view.posZ || view.field_70161_v || view.getPosZ && view.getPosZ()) : 0

        // translate to entity location relative to viewer
        GL11.glTranslatef(px - vpX, py - vpY, pz - vpZ)

        // apply scale (X, Y, Z)
        GL11.glScalef(scaleX, scaleY, scaleX)

        // render the entity (doRender or renderEntityStatic depending on environment)
        // try renderEntityStatic first (common), fallback to entity renderer doRender
        if (rm.renderEntityStatic) {
            try { rm.renderEntityStatic(ent, partialTicks, true) } catch (e) { /* ignore */ }
        } else if (rendererMap) {
            try {
                let renderer = null
                try { renderer = rendererMap.get(ent.getClass()) } catch (e) {}
                if (!renderer && ent.getClass) {
                    try { renderer = rendererMap.get(ent.getClass()) } catch (e) {}
                }
                if (renderer && renderer.doRender) {
                    try { renderer.doRender(ent, 0, 0, 0, ent.rotationYaw, partialTicks) } catch (e) { /* ignore */ }
                }
            } catch (e) { /* ignore */ }
        }

        GL11.glPopMatrix()
    } catch (err) {
        // avoid spamming errors in-game
        ChatLib.chat("&cplayerSize scaling error: " + err)
    }
})