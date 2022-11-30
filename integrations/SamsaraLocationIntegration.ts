import Integration from "../types/Integration"

import TelemetryDevice from "../types/TelemetryDevice"
import TelemetryDatum from "../types/TelemetryDatum"

import {createTagWithAssets, createAddress, updateTagAssets, getAllEquipment, getAllVehicles} from "../src/talus"

import { SamsaraAsset, SamsaraDevice, SamsaraEquipment, SamsaraVehicle } from "../types/Samsara"

export class SamsaraLocationIntegration implements Integration {

    private tagID = "3781326"

    constructor( 
        private tagName:string, 
        private formattedAddress:string, 
        private geofence:object, 
        private addressName:string, 
        ) {}

    /**
     * @returns {Promise<TelemetryDevice[]>} - A list of the telemetry devices at the associated event
     */
    discover() {
        return new Promise<TelemetryDevice[]>(async (resolve, reject) => {
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
            let devices = objs.map(mapSamsaraToTelemetryDevice)
            
            resolve(devices)
        })
    }

    update() {
        return new Promise<TelemetryDatum[]>(async (resolve, reject) => {
            var [vehicles, equipment] = await Promise.all([getAllVehicles(this.tagID), getAllEquipment(this.tagID)])
                .catch(err => {
                    throw err
                })
            
            let objs = [...vehicles, ...equipment]

            let data = objs.map(mapSamsaraToTelemetryDatum)
            resolve(data)
        })
        .catch(err => {
            throw err
        })
    }
}

function mapSamsaraToTelemetryDevice(obj: SamsaraDevice): TelemetryDevice {
    try {
        var name = obj.name
        var id = String(obj["id"])

        var device: TelemetryDevice = {
            identifier: id, 
            name: name
        }
        return device
    } catch (err) {
        throw err
    }
}
function mapSamsaraToTelemetryDatum(obj: SamsaraDevice): TelemetryDatum {
    try {
        var location = {
            longitude: obj.longitude, 
            latitude: obj.latitude
        }

        var id = String(obj["id"])
        var datum: TelemetryDatum = {
            identifier: id,
            location
        }
        return datum
    } catch (err) {
        throw err
    }
}