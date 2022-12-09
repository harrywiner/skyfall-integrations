
import axios, {AxiosResponse} from 'axios'
import Geofence from '../types/Geofence'
import TelemetryObject from '../types/TelemetryObject'
import TelemetryStatus from '../types/TelemetryStatus'
import { TokenResponse, StatusResponse } from '../types/ZeroNoxTypes'
const qs = require('qs')

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
        })
            .catch(err =>{ throw err })

        lastSize = res.data.length

        /**
         * Extract Objects
         */
        let foundObjects: TelemetryObject[] = res.data.map((e: StatusResponse) => {
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
        const token_url = 'https://staging-znox-identity-interactive.azurewebsites.net/connect/token';

        const axiosConfig = {
        timeout: 30000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        const requestData = {
            client_id: client_id,
            client_secret: client_secret,
            grant_type: grant_type,
        };

        axios
        .post(token_url, qs.stringify(requestData), axiosConfig)
        .then((res) => {
            // handle success
            let data: TokenResponse = res.data
            resolve(data.access_token);
        })
        .catch(function (error) {
            // handle error
            reject(error);
        });
    })
}