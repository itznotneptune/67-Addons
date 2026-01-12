const defaultColor = "§7";

export function chat(message) {
	ChatLib.chat("§8[§b67 Addons§8] " + defaultColor + message.toString().replaceAll("§r", defaultColor));
}

export default { chat };
