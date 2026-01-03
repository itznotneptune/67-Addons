/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import settings from "./settings"

register("command", () => settings.openGUI()).setName("wa");

require("./watcher")
require("./livid")
require("./util")
require("./firstTime")

