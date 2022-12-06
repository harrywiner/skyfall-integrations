
import axios, {AxiosResponse} from 'axios'
import Geofence from '../types/Geofence'
import TelemetryObject from '../types/TelemetryObject'
import TelemetryStatus from '../types/TelemetryStatus'
import { TokenResponse } from '../types/ZeroNoxTypes'

const pako = require('pako')

export async function getObjectsAndStatus(token: string): Promise<TelemetryObject[]>  {
    let objects: TelemetryObject[] = []
    //let status: TelemetryStatus[] = []
    
    /**
     * Page size and page number
     * page number starts from 1 *sigh*
     */
    let ps = 10
    let pn = 1

    /**
     * Iterate until receive an empty payload
     */
    let lastSize = -1

    do {
        let url = `https://staging-znox-business.azurewebsites.net/api/devices/statuses?pn=${pn}&ps=${ps}`

        let res = await axios.get(url,
        {
            headers: {"Authorization": `Bearer ${token}`}, 
            decompress:true, 
            responseType: "arraybuffer", 
            responseEncoding: "utf8"
        })
            .catch(err =>{ throw err })

        /**
         * Decode from GZip using 'pako'
         */
        const decoded: Array<any> = JSON.parse(pako.inflate(res.data, { to: 'string' }));
        lastSize = decoded.length

        /**
         * Extract Objects
         */
        let foundObjects: TelemetryObject[] = decoded.map((e) => {
            return { 
                name: e["telematicsDeviceBase"]["vin"], 
                identifier: e["telematicsDeviceBase"]["vin"],
                status: {
                    identifier: e["telematicsDeviceBase"]["vin"],
                    location: {latitude: e["deviceGpsData"]["latitude"], longitude: e["deviceGpsData"]["longitude"]},
                    batteryCharge: e["deviceTeleMaticsData"]["stateOfCharge"]
                }
            }
        })

        objects.push(...foundObjects)

        pn++
    } while (lastSize !== 0)

    return objects
}

/**
 * Todo: 
 * * create / import geofence object
 * * Point In Polygon implementation
 */
export function filterObjectsByStatusInGeofence(objects: TelemetryObject[], geofence: Geofence): TelemetryObject[] {
    return objects
}

export function refreshToken(client_id: string, scope: string, client_secret: string, grant_type: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let url = "https://staging-znox-identity-interactive.azurewebsites.net/connect/token"
        let data = {
            client_id,
            scope,
            client_secret,
            grant_type
        }

        let headers = {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Accept-Encoding": "gzip",
            "decompress":true, 
            "responseType": "json", 
            "responseEncoding": "utf8"
        }

        axios.post(url, data, { headers })
            .then((res) => {
                const decoded: TokenResponse = JSON.parse(pako.inflate(res.data, { to: 'string' }));
                let token: string = decoded["access_token"]
                resolve(token)
            })
            .catch(err => {
                throw err})
    })
}