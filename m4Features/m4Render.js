// --------------------------------- Imports --------------------------------- \\

import config from "../config.js"

// ---------------------------------  Variables --------------------------------- \\

const thornRail = [
  [-18.72, 84,  5.76],
  [-17.17, 84, -7.07],
  [ -8.74, 84, -15.29],
  [  3.64, 84, -18.63],
  [ 16.63, 84, -17.17],
  [ 24.85, 84,  -9.15],
  [ 28.56, 84,   3.88],
  [ 26.85, 84,  16.87],
  [ 18.34, 84,  25.34],
  [  6.20, 84,  28.48],
  [ -7.11, 84,  27.05],
  [-15.26, 84,  18.75]
];

let inM4 = false;
let m4RenderWaypoints = config.m4RenderWaypoints;
let m4RenderRail = config.m4RenderRail;
let m4RenderAnimals = config.m4RenderAnimals;

// --------------------------------- Debug Commands --------------------------------- \\

register("command", () => {
    inM4 = !inM4;
    ChatLib.chat(`§d§l[67Addons] §aM4 Render: ${inM4}`);
}).setName("inM4Render");

// --------------------------------- Hitbox and Color List --------------------------------- \\

animalList = [
  ["EntityBat",     0.5,0.5,0.5, 1,0,0,1],
  ["EntityChicken", 0.5,0.5,0.5, 1,1,0,1],
  ["EntityRabbit",  0.5,0.5,0.5, 1.0,1.0,1.0,1],
  ["EntitySheep",   1.5,1.5,1.5, 0.8,0.8,0.8,1],
  ["EntityWolf",    1.0,1.0,1.0, 0.8,0.8,0.8,1],
  ["EntityCow",     1.5,1.5,1.5, 0.3,0.3,0.3,1]
];

// --------------------------------- Render Toggles --------------------------------- \\

let bat = config.batRender;
let chicken = config.chickenRender;
let rabbit = config.rabbitRender;
let sheep = config.sheepRender;
let wolf = config.wolfRender;
let cow = config.cowRender;

function animalToggled(name) {
  switch (name) {
    case "EntityBat": return bat;
    case "EntityChicken": return chicken;
    case "EntityRabbit": return rabbit;
    case "EntitySheep": return sheep;
    case "EntityWolf": return wolf;
    case "EntityCow": return cow;
  }
  return false;
}

// --------------------------------- Registers --------------------------------- \\

register("tick", () => {
    inM4 = false;
    Scoreboard.getLines().forEach(l => {
        let n = l.getName().replace(/§[0-9A-FK-OR]/gi, "")
        if( n.includes("The Cat") && (n.includes("M4") || n.includes("F4"))) { inM4 = true }
    }
)});

register("renderWorld", () => {
    if((!inM4 && config.m4Render) || Player.getZ() < -40) {return};
    if (m4RenderWaypoints) {
        drawBox(5.5,  69.0, 4.5,  /**/ 1, 0, 1, /**/ 0.0, 0.0, 0.0, 1.0); // bow (flat)
        drawBox(27.5, 81.5, 18.5, /**/ 1, 0, 1, /**/ 0.0, 0.0, 0.0, 1.0); // shoot
        drawBox(-4.5, 83.5, 27.5, /**/ 1, 0, 1, /**/ 0.0, 0.0, 0.0, 1.0); // backstun
    }

    if (m4RenderRail) {drawThornRail(0.0, 0.0, 0.0, 1.0)}

    if(m4RenderAnimals) { animalList.forEach(([cls,w,h,d,r,g,b,a]) => {
    if(animalToggled(cls)) {
      World.getAllEntities().filter(e => e.getClassName()===cls).forEach(e => {
        drawBox(e.getX(), e.getY(), e.getZ(), w,h,d,r,g,b,a);
            })
        }
    })}
})

// --------------------------------- Functions --------------------------------- \\

function drawBox(x, y, z, w, h, d, r, g, b, a) {
    GL11.glBlendFunc(770, 771);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glLineWidth(3);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glDisable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(false);
    Tessellator.pushMatrix(); // draw:
    Tessellator.begin(GL11.GL_LINE_STRIP).colorize(r, g, b, a);
    Tessellator.pos(x - w/2, y - h/2, z - d/2);
    Tessellator.pos(x + w/2, y - h/2, z - d/2);
    Tessellator.pos(x + w/2, y - h/2, z + d/2);
    Tessellator.pos(x - w/2, y - h/2, z + d/2);
    Tessellator.pos(x - w/2, y - h/2, z - d/2);
    Tessellator.pos(x - w/2, y + h/2, z - d/2);
    Tessellator.pos(x + w/2, y + h/2, z - d/2);
    Tessellator.pos(x + w/2, y + h/2, z + d/2);
    Tessellator.pos(x - w/2, y + h/2, z + d/2);
    Tessellator.pos(x - w/2, y + h/2, z - d/2);
    Tessellator.pos(x - w/2, y - h/2, z - d/2);
    Tessellator.pos(x + w/2, y - h/2, z - d/2);
    Tessellator.pos(x + w/2, y + h/2, z - d/2);
    Tessellator.pos(x + w/2, y - h/2, z - d/2);
    Tessellator.pos(x + w/2, y - h/2, z + d/2);
    Tessellator.pos(x - w/2, y - h/2, z + d/2);
    Tessellator.pos(x - w/2, y + h/2, z + d/2);
    Tessellator.pos(x + w/2, y + h/2, z + d/2);
    Tessellator.pos(x + w/2, y - h/2, z + d/2);
    Tessellator.draw();
    Tessellator.popMatrix(); // restore
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(true);
    GL11.glDisable(GL11.GL_BLEND);
}


function drawThornRail(r, g, b, a) {
    GL11.glBlendFunc(770, 771);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glLineWidth(3);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glDisable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(false);

    Tessellator.pushMatrix(); // draw:
    Tessellator.begin(GL11.GL_LINE_STRIP).colorize(r, g, b, a);

    for (let i = 0; i < thornRail.length; i++) {
        Tessellator.pos(thornRail[i][0], 84, thornRail[i][2]);
    } // back to first point of polygon
    Tessellator.pos(thornRail[0][0], 84, thornRail[0][2]);

    Tessellator.draw();
    Tessellator.popMatrix(); // restore
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(true);
    GL11.glDisable(GL11.GL_BLEND);
}