/// <reference types="../../CTAutocomplete" />

const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction");

if (!global["67addons"]) global["67addons"] = {};
if (!global["67addons"].events) global["67addons"].events = {};
if (!global["67addons"].events.tick) global["67addons"].events.tick = {};

const listeners = global["67addons"].events.tick.listeners || (global["67addons"].events.tick.listeners = []);

const trigger = global["67addons"].events.tick.trigger || (global["67addons"].events.tick.trigger = register("packetReceived", function(packet) {
	if (packet.func_148890_d() >= 0) return;
	for (let i = 0; i < listeners.length; i++) {
		try { listeners[i](); } catch (e) { /* ignore listener errors */ }
	}
}).setFilteredClass(S32PacketConfirmTransaction).unregister());

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

export function schedule(ticks, callback) {
	const onTick = () => {
		--ticks;
		if (ticks <= 0) {
			removeListener(onTick);
			callback();
		}
	};
	addListener(onTick);
}

export default { addListener, removeListener, schedule };
