// Used to copy lore from items to make it easier to debug

export default new class Logger {
    constructor() {
        this.str = ""
    }

    push(str) {
        if (this.str !== "") {
            this.str += "\n"
        }

        this.str += str
    }

    copy() {
        if (this.str) {
            ChatLib.command(`ct copy ${this.str}`, true)
            return
        }
        
        const str = FileLib.read("67-Addons", "data/log.txt")
        ChatLib.command(`ct copy ${str}`, true)
    }

    clear() {
        this.str = ""
    }

    write() {
        FileLib.write("67-Addons", "data/log.txt", this.str, true)
    }
}