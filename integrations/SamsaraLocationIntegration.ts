import Integration from "../types/Integration"

import TelemetryObject from "../types/TelemetryObject"
import TelemetryStatus from "../types/TelemetryStatus"

import {createTagWithAssets, createAddress, updateTagAssets, getAllEquipment, getAllVehicles} from "../src/SamsaraApi"

import { SamsaraDevice } from "../types/Samsara"

export class SamsaraLocationIntegration implements Integration {

    private tagID = ""

    constructor( 
        private tagName:string, 
        private formattedAddress:string, 
        private geofence:object, 
        private addressName:string, 
        ) {}

    /**
     * @returns {Promise<TelemetryObject[]>} - A list of the telemetry devices at the associated event
     */

    authenticate() {
        // Unused, should authenticate api object to pass to api methods
        return Promise.resolve(undefined)
    }
    discover() {
        return new Promise<TelemetryObject[]>(async (resolve, reject) => {
            console.log("Hello World")

            /**
             * Create new tag and address or update the existing tag
            * Thereby discover devices in the geofence
            */
            if (this.tagID === "") {
                await createAddress(this.addressName, this.formattedAddress, this.geofence)
                var tagID = await createTagWithAssets(this.addressName, this.tagName).catch(err => {throw err})
                this.tagID = tagID
            } else {
                await updateTagAssets(this.addressName, this.tagID, this.tagName)
                    .then((newID: string) => this.tagID = newID)
            }
    
            /**
             * Get Discovered devices
             */
            var [vehicles, equipment] = await Promise.all([getAllVehicles(this.tagID), getAllEquipment(this.tagID)])
                .catch(err => {
                    throw err
                })
            
            let objs = [...vehicles, ...equipment]
            let devices = objs.map(mapSamsaraToTelemetryObject)
            
            resolve(devices)
        })
    }

    update() {
        return new Promise<TelemetryStatus[]>(async (resolve, reject) => {
            var [vehicles, equipment] = await Promise.all([getAllVehicles(this.tagID), getAllEquipment(this.tagID)])
                .catch(err => {
                    throw err
                })
            
            let objs = [...vehicles, ...equipment]

            let data = objs.map(mapSamsaraToTelemetryStatus)
            resolve(data)
    })
        .catch(err => {
            throw err
        })
    }
}

function mapSamsaraToTelemetryObject(obj: SamsaraDevice): TelemetryObject {
    try {
        var name = obj.name
        var id = String(obj["id"])

        var device: TelemetryObject = {
            identifier: id, 
            name: name
        }
        return device
    } catch (err) {
        throw err
    }
}
function mapSamsaraToTelemetryStatus(obj: SamsaraDevice): TelemetryStatus {
    try {
        var location = {
            longitude: obj.longitude, 
            latitude: obj.latitude
        }

        var id = String(obj["id"])
        var datum: TelemetryStatus = {
            identifier: id,
            location
        }
        return datum
    } catch (err) {
        throw err
    }
}