import Integration from "../types/Integration"
import { getObjectsAndStatus, filterObjectsInGeofence } from "../src/zeronox"

require('dotenv').config()
const TOKEN = process.env.ZERONOX_TOKEN
if (TOKEN === undefined) {
    throw Error("No token found")
}


export default class ZeroNoxIntegration implements Integration {

    constructor(public geofence: any){}

    authenticate() {
        return Promise.resolve(TOKEN)
    }

    async discover(token: string) {
        let objects = await getObjectsAndStatus(token)

        return filterObjectsInGeofence(objects, {})
    }

    update(token: string) {
        return Promise.resolve([])
    }
}