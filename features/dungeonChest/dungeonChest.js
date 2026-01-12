import request from "../../../RequestV2"
import Promise from "../../../PromiseV2"
import logger from "./logger"

// ------------------------------ Values Caching ------------------------------ \\

let cachedBzValues = {}
let cachedItems = {}
let cachedBins = {}

let itemIdMap = {} // {sbID: APIItemData}

// ------------------------------ Item Data Logger ------------------------------ \\

if (FileLib.exists("67-Addons", "features/dungeonChest/data/bzValues.json")) {
    cachedBzValues = JSON.parse(FileLib.read("67-Addons", "features/dungeonChest/data/bzValues.json"))
}

if (FileLib.exists("67-Addons", "features/dungeonChest/data/items.json")) {
    cachedItems = JSON.parse(FileLib.read("67-Addons", "features/dungeonChest/data/items.json"))
    itemIdMap = {}

    for (let item of cachedItems) {
        itemIdMap[item.id] = item
    }
}

if (FileLib.exists("67-Addons", "features/dungeonChest/data/binValues.json")) {
    cachedBins = JSON.parse(FileLib.read("67-Addons", "features/dungeonChest/data/binValues.json"))
}

export const getBzValues = () => cachedBzValues
export const getSkyblockItems = () => cachedItems
export const getBinValues = () => cachedBins

// ------------------------------ Update Item Time ------------------------------ \\

export const getItemApiData = (sbId) => {
    if (!(sbId in itemIdMap)) {
        return null
    }

    return itemIdMap[sbId]
}

const handleBzData = (resp) => {
    if (!resp.success) {
        return [false, resp.cause]
    }

    let data = {}
    if (FileLib.exists("67-Addons", "features/dungeonChest/data/bzValues.json")) {
        data = JSON.parse(FileLib.read("67-Addons", "features/dungeonChest/data/bzValues.json"))
    }

    const products = resp.products

    for (let entry of Object.entries(products)) {
        let [itemID, info] = entry

        // Take the top three order and average their prices to try and get an accurate value for the item
        let buyOrders = info.buy_summary
        let sellOrderValue = info.quick_status.buyPrice
        if (buyOrders.length) {
            let sample = buyOrders.slice(0, 5)
            sellOrderValue = sample.reduce((a, b) => a + b.pricePerUnit, 0) / sample.length
        }

        // Insta sells go directly to buy orders
        let sellOrders = info.sell_summary
        let instaSellValue = info.quick_status.sellPrice
        if (sellOrders.length) {
            let sample = sellOrders.slice(0, 5)
            instaSellValue = sample.reduce((a, b) => a + b.pricePerUnit, 0) / sample.length
        }

        data[itemID] = {
            sellOrderValue,
            instaSellValue,
        }
    }

    cachedBzValues = data
    FileLib.write("67-Addons", "features/dungeonChest/data/bzValues.json", JSON.stringify(data, null, 4), true)

    return [true, ""]
}

const handleItemResp = (resp) => {
    if (!resp.success) {
        return [false, resp.cause]
    }

    cachedItems = resp.items
    for (let item of cachedItems) {
        itemIdMap[item.id] = item
    }

    FileLib.write("67-Addons", "features/dungeonChest/data/items.json", JSON.stringify(resp.items, null, 4), true)

    return [true, ""]
}

const handleBinResp = (resp) => {
    cachedBins = resp
    FileLib.write("67-Addons", "features/dungeonChest/data/binValues.json", JSON.stringify(resp, null, 4))

    return [true, ""]
}

export const updatePrices = () => new Promise((resolve, reject) => {
    Promise.all([
        request({
            url: "https://api.hypixel.net/skyblock/bazaar",
            json: true
        }),
        request({
            url: "https://api.hypixel.net/v2/resources/skyblock/items",
            json: true
        }),
        request({
            url: "https://moulberry.codes/lowestbin.json",
            json: true
        }),
    ]).then(([bzResp, itemResp, binResp]) => {
        const bzSuccess = handleBzData(bzResp)
        const itemSuccesss = handleItemResp(itemResp) 
        const binSuccess = handleBinResp(binResp)

        if (!bzSuccess[0]) {
            logger.push(`Failed bzSuccess: ${JSON.stringify(bzSuccess[1])}`)
            reject(bzSuccess[1])
            return
        }
        
        if (!itemSuccesss[0]) {
            logger.push(`Failed itemSuccesss: ${JSON.stringify(itemSuccesss[1])}`)
            reject(itemSuccesss[1])
            return
        }

        if (!binSuccess[0]) {
            logger.push(`Failed binSuccess: ${JSON.stringify(binSuccess[1])}`)
            reject(binSuccess[1])
            return
        }

        resolve()
    }).catch(e => {
        logger.push(`Failed to grab prices: ${JSON.stringify(e)}`)
        reject(e)
    })

})


export const getSellPrice = (sbID, useSellOrder=true) => {

    const bzData = getBzValues()
    if (sbID in bzData) {
        if (useSellOrder) {
            return bzData[sbID].sellOrderValue
        }
        return bzData[sbID].instaSellValue
    }

    const binData = getBinValues()
    if (sbID in binData) {
        return binData[sbID]
    }

    logger.push(`Could not find price for ${sbID} (${Object.keys(bzData).length} items in BZ, ${Object.keys(binData).length} items in BIN)`)

    return null
}

// ------------------------------ Auto Update Item Prices ------------------------------ \\

register("worldLoad", () => {
    updatePrices()
})