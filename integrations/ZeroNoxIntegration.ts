import Integration from "../types/Integration"
import TelemetryStatus from "../types/TelemetryStatus"
import { getObjectsAndStatus, filterObjectsByStatusInGeofence, refreshToken } from "../src/ZeroNoxApi"
import Geofence from "../types/Geofence"

require('dotenv').config()
const CLIENT_ID = process.env.ZERONOX_CLIENT_ID
const CLIENT_SECRET = process.env.ZERONOX_CLIENT_SECRET


export default class ZeroNoxIntegration implements Integration {

    constructor(public geofence: Geofence){}

    authenticate() {
        if (CLIENT_ID === undefined) {
            throw Error("No ZeroNox client_id found")
        }
        if (CLIENT_SECRET === undefined) {
            throw Error("No ZeroNox client_secret found")
        }
        
        return refreshToken(CLIENT_ID, "BusinessApi", CLIENT_SECRET, "client_credentials")
    }

    async discover(token: string) {
        let objects = await getObjectsAndStatus(token)

        return filterObjectsByStatusInGeofence(objects, this.geofence)
    }

    async update(token: string) {
        let objects =  await getObjectsAndStatus(token)
        let status = objects.map((e) => e.status)
        let exists: TelemetryStatus[] = []
        status.forEach(e => {
            if (e !== undefined) {
                exists.push(e)
            }
        })
        return exists
    }
}