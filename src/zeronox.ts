
import axios from 'axios'
import TelemetryObject from '../types/TelemetryObject'
import TelemetryStatus from '../types/TelemetryStatus'

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
        let res = await axios.get(url,{headers: {"Authorization": `Bearer ${token}`}, decompress:true, responseType: "arraybuffer", responseEncoding: "utf8"})
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
                    location: {latitude: e["deviceGpsData"]["latitude"], longitude: e["deviceGpsData"]["longitude"]}
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
export function filterObjectsInGeofence(objects: TelemetryObject[], geofence: any) {
    return objects
}