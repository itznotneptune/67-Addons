/// <reference types="../../CTAutocomplete" />

const S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat");

if (!global["67addons"]) global["67addons"] = {};
if (!global["67addons"].events) global["67addons"].events = {};
if (!global["67addons"].events.packetChat) global["67addons"].events.packetChat = {};

const listeners = global["67addons"].events.packetChat.listeners || (global["67addons"].events.packetChat.listeners = []);

const trigger = global["67addons"].events.packetChat.trigger || (global["67addons"].events.packetChat.trigger = register("packetReceived", function(packet, event) {
	if (packet.func_179841_c() === 2) return;

	var message = ChatLib.removeFormatting(packet.func_148915_c().func_150260_c());

	for (var i = 0; i < listeners.length; i++) {
		try { listeners[i](message, packet, event); } catch (e) { /* ignore */ }
	}
}).setFilteredClass(S02PacketChat).unregister());

export function addListener(listener) {
	if (listeners.length === 0) trigger.register();
	listeners.push(listener);
}

export function removeListener(listener) {
	const index = listeners.indexOf(listener);
	if (index === -1) return false;
	listeners.splice(index, 1);
	if (listeners.length === 0) trigger.unregister();
	return true;
}

export default { addListener, removeListener };
