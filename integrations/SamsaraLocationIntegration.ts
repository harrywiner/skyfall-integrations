import Integration from "../types/Integration"

import TelemetryObject from "../types/TelemetryObject"
import TelemetryStatus from "../types/TelemetryStatus"

import {createTagWithAssetsInAddress, createAddress, updateTagAssets, getAllTaggedEquipment, getAllTaggedVehicles} from "../src/SamsaraApi"

import { SamsaraDevice } from "../types/Samsara"

/** for debugging with persistance */
const fs = require('fs');

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
                createTagWithAssetsInAddress(this.addressName, this.tagName)
                    .then((tagID) => {
                        this.tagID = tagID
                        fs.writeFile("../data/tag.txt", this.tagID, (err: Error) => {console.error(err)})
                    })
                    .catch(err => {
                        reject(err)
                    })
                
                if (this.tagID == "") {
                    // err in createTag
                    return
                }
                
            } else {
                await updateTagAssets(this.addressName, this.tagID, this.tagName)
                    .then((newID: string) => {
                        this.tagID = newID
                        fs.writeFile("../data/tag.txt", this.tagID, (err: Error) => {console.error(err)})
                    })
            }
    
            /**
             * Get Discovered devices
             * Add more to Promise.all to increase capture 
             */
            var [vehicles] = await Promise.all([getAllTaggedEquipment(this.tagID)])
                .catch(err => {
                    throw err
                })
            
            let objs = [...vehicles]
            let devices = objs.map(mapSamsaraToTelemetryObject)
            
            resolve(devices)
        })
    }

    update() {
        return new Promise<TelemetryStatus[]>(async (resolve, reject) => {
            var [vehicles, equipment] = await Promise.all([getAllTaggedVehicles(this.tagID), getAllTaggedEquipment(this.tagID)])
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