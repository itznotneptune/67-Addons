import { @Vigilant, @TextProperty, @ColorProperty, @ButtonProperty, @SwitchProperty, @SliderProperty, @PercentSliderProperty, @SelectorProperty, Color } from 'Vigilance';

//Thanks bloomy
@Vigilant("watcherAddons", "watcherAddons", { 
    getCategoryComparator: () => (a, b) => {
        const categories = ["General","Watcher", "Livid"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {

    constructor() {
        this.initialize(this);
        this.setCategoryDescription(
            "General",
            `
            §6§l[§3 Watcher Addons §6§l]§r

            §7§oMade by W0RD
            §7§oEdited by Mage677
            `
        )}
    

    campGui = new Gui()
    lividGui = new Gui()

    @SwitchProperty({
        name: "Global Toggle",
        description: "Toggles the entire module",
        category: "General"
    })
    waToggle = true

    @SwitchProperty({
        name: "&4Disable Boss Messages",
        description: "&cIf you use &cany other mods &cto disable boss &cmessages, this module will &lNOT&r&c work.",
        category: "General"
    })
    bossMsg = false

    @ButtonProperty({
        name: "&9Discord link",
        description: "Found a bug? Want to stay up to date on development? Just want to flame my laggy code? Click the button and join wordcord today! Just remember to select the watcher addons role when joining the server.",
        category: "General",
        placeholder: "Join!"
    })
    discordLink() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://discord.gg/gnNNsz5kVj"))
    };

    //Watcher camp stuff

    @SwitchProperty({
        name: "Camp Info",
        description: "Toggles displaying the camp info on your screen",
        category: "Watcher",
        subcategory: "Camp"
    })
    campInfo = true

    @ButtonProperty({
        name: "Move Camp Info",
        description: "Allows you to move the camp info on your screen",
        category: "Watcher",
        subcategory: "Camp",
        placeholder: "Move"
    })
    MoveInfo() {
        this.campGui.open()
    };

    @SwitchProperty({
        name: "Hide Camp in Boss",
        description: "Lets you hide the camp info when you enter the boss fight",
        category: "Watcher",
        subcategory: "Camp"
    })
    hideCampInBoss = false

    @SwitchProperty({
        name: "Watcher Dialogue Notif",
        description: "Toggles a notification appearing when the watcher has finished spawning the first four mobs",
        category: "Watcher",
        subcategory: "Notifications"
    })
    dialogueNotif = true

    @SwitchProperty({
        name: "Easy Mode Kill Notif",
        description: "If enabled, only displays a notif when the blood mobs are ready to be killed. &bNOTE: Not always accurate, you will get better move times by learning when to kill the mobs yourself",
        category: "Watcher",
        subcategory: "Notifications"
    })
    babyMode = false

    @SwitchProperty({
        name: "Watcher Chat Info",
        description: "Toggles whether certain events / times are posted in chat",
        category: "Watcher",
        subcategory: "Camp"
    })
    chatInfo = true

    @SelectorProperty({
        name: "Watcher Chat Info Style",
        description: "Allows you to change the style of the chat message at the end of the camp",
        category: "Watcher",
        subcategory: "Camp",
        options: [
            "Full camp only",
            "Post move camp only",
            "Both [Compressed]"
        ]
    })
    chatInfoStyle = 2;

    //Livid stuff

    @SwitchProperty({
        name: "Livid Vuln Timer",
        description: "Displays a tick-based timer that counts down to when livid is vulnerable",
        category: "Livid",
        subcategory: "Timer"
    })
    lividTimer = true

    @ButtonProperty({
        name: "Move Livid Vuln Timer",
        description: "Allows you to move the livid vuln timer on your screen",
        category: "Livid",
        subcategory: "Timer",
        placeholder: "Move"
    })
    MoveTimer() {
        this.lividGui.open()
    };

    @ButtonProperty({
        name: "Looking for a livid highlighter?",
        description: "Most mods have one, but as you have CT why not try &c/ct &cimport &clividsolver&r? If I put one in here it would just be a carbon copy of that anyway :(",
        category: "Livid",
        subcategory: "ESP",
        placeholder: " "
    })
    lividesp() {};
}

export default new Settings;