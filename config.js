import { @Vigilant, @SwitchProperty, @TextProperty, @CheckboxProperty, @ButtonProperty, @SelectorProperty, @SliderProperty, @ColorProperty, @PercentSliderProperty, @DecimalSliderProperty, Color} from "../Vigilance/index"

@Vigilant("67-Addons", "§d§l67Addons", {
  getCategoryComparator: () => (a, b) => {
    const categories = ["General","Dungeons","Commands","F/M 4"]
    return categories.indexOf(a.name) - categories.indexOf(b.name);
  }
})

class config {    
  @SwitchProperty({
    name: "Blood Rush Splits",
    description: "Tells you how long it took to clear each room on blood rush if you are archer or mage",
    category: "Dungeons",
    subcategory: "Blood rush"
})
bloodRushSplits = false;

@SwitchProperty({
    name: "Show On Every Class",
    description: "Shows Blood Rush Splits on every class instead of just Archer and Mage",
    category: "Dungeons",
    subcategory: "Blood rush"
})
showOnEveryClass = false;

// @SwitchProperty({
//   name: "Rapid Fire Message",
//   description: "Sends a message when you use rapid fire",
//   category: "Dungeons",
//   subcategory: "General"
// })
// rapid = false;

// @SwitchProperty({
//   name: "Explo Shot Message",
//   description: "Shows explosive shot damage per enemy",
//   category: "Dungeons",
//   subcategory: "General"
// })
// explo = false;

@SwitchProperty({
  name: "Party Chat Dungeon Queue Command",
  description: "Command: ff0 mm1",
  category: "Commands",
  subcategory: "Commands"
})
dungeonCmd = false;


@SwitchProperty({
  name: "Block Wrong Relic Clicks",
  description: "Prevents you from placing your relic in the wrong cauldron and dying",
  category: "Dungeons",
  subcategory: "Relics"
})
blockRelicClicks = false;

@SwitchProperty({
  name: "Highlight Correct Cauldron",
  description: "Highlights the corresponding cauldron to the relic you picked up",
  category: "Dungeons",
  subcategory: "Relics"
})
highlightCauldron = false;

@SwitchProperty({
  name: "Show Highlight Through Blocks",
  description: "Shows the correct relic cauldron through blocks",
  category: "Dungeons",
  subcategory: "Relics"
})
cauldronPhase = false;

// @SwitchProperty({
//   name: "Hide Player After Leap",
//   description: "Hide players after leaping",
//   category: "Dungeons",
//   subcategory: "General"
// })
// hidePlayersAfterLeap = false;

// @SwitchProperty({
//   name: "Only Hide In Boss",
//   description: "Only hide players after leap in boss",
//   category: "Dungeons",
//   subcategory: "General"
// })
// onlyHideInBoss = false;

@SwitchProperty({
  name: "Send Relic",
  description: "Send what relic you get in chat",
  category: "Dungeons",
  subcategory: "Relics"
})
Relic = false;

@SwitchProperty({
        name: "Auto Refill Pearls",
        description: "Automatically refills your stack of ender pearls when you have less than a specific threshold",
        category: "General",
        subcategory: "Auto Refill"
    })
    autoRefillPearls = false;

    @SliderProperty({
        name: "Auto Refill Pearls Threshold",
        description: "Refills pearls when stack size goes under this number",
        category: "General",
        subcategory: "Auto Refill",
        min: 1,
        max: 16
    })
    autoRefillPearlsThreshold = 8;

    @SwitchProperty({
        name: "Auto Refill Jerries",
        description: "Automatically refills your stack of inflatable jerries when you have less than a specific threshold",
        category: "General",
        subcategory: "Auto Refill"
    })
    autoRefillJerries = false;

    @SliderProperty({
        name: "Auto Refill Jerries Threshold",
        description: "Refills jerries when stack size goes under this number",
        category: "General",
        subcategory: "Auto Refill",
        min: 1,
        max: 64
    })
    autoRefillJerriesThreshold = 32;

    @SwitchProperty({
        name: "Auto Refill SuperBoomTNT",
        description: "Automatically refills your stack of SuperBoomTNT when you have less than a specific threshold",
        category: "General",
        subcategory: "Auto Refill"
    })
    autoRefillSuperBoom = false;

    @SliderProperty({
        name: "Auto Refill SuperBoomTNT Threshold",
        description: "Refills SuperBoomTNT when stack size goes under this number",
        category: "General",
        subcategory: "Auto Refill",
        min: 1,
        max: 64
    })
    autoRefillTNTThreshold = 32;

    @SwitchProperty({
        name: "Score Milestones",
        description: "Sends a message with a timestamp once 270 and 300 score are reached ",
        category: "Dungeons",
        subcategory: "General"
    })
    scoreMilestones = false;

    @SwitchProperty({
        name: "Force Paul",
        description: "Force +10 score",
        category: "Dungeons",
        subcategory: "General"
    })
    scoreMilestonesPaul = false;

    @SwitchProperty({
        name: "Announce Crypts",
        description: "Sends in party when we get 5/5 crypts",
        category: "Dungeons",
        subcategory: "General",
    })
     Crypt = true;

     @SwitchProperty({
		name: "Core Timestamps",
		description: "Send Last player enter core time",
		category: "Dungeons",
		subcategory: "General",
	})
	coremsg = true;

     @SwitchProperty({
		name: "Rag Axe Message",
		description: "Send a message when your rag axe get cancelled due to taking damage ",
		category: "General",
		subcategory: "General",
	})
	ragcancel = true;

       @SwitchProperty({
		name: "Auto Equip Mask",
		description: "Automatically equip a mask when health is low (< 40%)",
		category: "General",
		subcategory: "General",
	})
	automask = true;

  @SwitchProperty({
    name: "Leap Message",
    description: "Sends a message when you leap",
    category: "Dungeons",
    subcategory: "General",
  })
  leapMsg = true;

  @SwitchProperty({
    name: "Crystal Alert",
    description: "Alerts you when you have a crystal",
    category: "Dungeons",
    subcategory: "F7",
  })
  placeCrystalAlert = true;

  @SwitchProperty({
    name: "Crystal Message",
    description: "Alerts your party members in chat when you pick up or place down crystals",
    category: "Dungeons",
    subcategory: "F7",
  })
  placeCrystalAlertChat = false;

  @SwitchProperty({
    name: "M4 Mobs Display",
    description: "Displays number of mobs in M4",
    category: "F/M 4",
    subcategory: "General",
  })
  m4MobsDisplay = true;

  @SwitchProperty({
    name: "M4 Mob Render",
    description: "Renders mobs in M4 boss fight",
    category: "F/M 4",
    subcategory: "General",
  })
  m4Render = true;

  @SwitchProperty({
    name: "Render Waypoints",
    description: "Renders M4 Waypoints",
    category: "F/M 4",
    subcategory: "Render",
  })
  m4RenderWaypoints = true;

  @SwitchProperty({
    name: "Render Rail",
    description: "Renders Thorn Rail in M4",
    category: "F/M 4",
    subcategory: "Render",
  })
  m4RenderRail = true;

  @SwitchProperty({
    name: "Render Animals",
    description: "Renders Animals in M4 Boss Fight",
    category: "F/M 4",
    subcategory: "Render",
  })
  m4RenderAnimals = true;

  @SwitchProperty({
    name: "Bat Render",
    description: "Renders Bats in M4 Boss Fight",
    category: "F/M 4",
    subcategory: "Animals Render",
  })
  batRender = false;

  @SwitchProperty({
    name: "Chicken Render",
    description: "Renders Chickens in M4 Boss Fight",
    category: "F/M 4",
    subcategory: "Animals Render",
  })
  chickenRender = true;

  @SwitchProperty({
    name: "Rabbit Render",
    description: "Renders Rabbits in M4 Boss Fight",
    category: "F/M 4",
    subcategory: "Animals Render",
  })
  rabbitRender = true;

  @SwitchProperty({
    name: "Sheep Render",
    description: "Renders Sheep in M4 Boss Fight",
    category: "F/M 4",
    subcategory: "Animals Render",
  })
  sheepRender = false;

  @SwitchProperty({
    name: "Wolf Render",
    description: "Renders Wolves in M4 Boss Fight",
    category: "F/M 4",
    subcategory: "Animals Render",
  })
  wolfRender = true;

  @SwitchProperty({
    name: "Cow Render",
    description: "Renders Cows in M4 Boss Fight",
    category: "F/M 4",
    subcategory: "Animals Render",
  })
  cowRender = false;

  // @SwitchProperty({
  //   name: "Player Size",
  //   description: "Change the size of your player model",
  //   category: "General",
  //   subcategory: "General",
  // })
  // playerSize = true;

  constructor() {
    this.initialize(this);
    this.setCategoryDescription("Blood Rush Splits", "Show On Every Class")
    // this.setCategoryDescription("Rapid Fire Message", "Party Chat Dungeon Queue Command")
    this.setCategoryDescription("Party Chat Dungeon Queue Command", "Block Wrong Relic Clicks")
    // this.setCategoryDescription("Explo Shot Message", "Block Wrong Relic Clicks")
    this.setCategoryDescription("Highlight Correct Cauldron", "Show Highlight Through Blocks")
    // this.setCategoryDescription("Hide Player After Leap")
    // this.setCategoryDescription("Only Hide In Boss","Send Relic")
    this.setCategoryDescription("Send Relic")
    this.setCategoryDescription("Leap Message")
    this.setCategoryDescription("Auto Refill Pearls","Auto Refill Pearls Threshold")
    this.setCategoryDescription("Auto Refill Jerries","Auto Refill Jerries Thershold")
    this.setCategoryDescription("Auto Refill SuperBoomTNT","Auto Refill SuperBoomTNT Thershold")
    this.setCategoryDescription("Score Milestones","Announce Crypts")
    this.setCategoryDescription("Core Timestamps","Rag Axe Message")


  }
}
export default new config();