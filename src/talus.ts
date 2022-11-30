/**
 * Samsara API functionality
 */
require('dotenv').config()
const TOKEN = process.env.SAMSARA_TOKEN
if (TOKEN === undefined) {
    throw Error("No token found")
}

const sdk = require('api')('@samsara-dev-rel/v2019.01.01#2xqng621f6l8vvz9pu');

// TODO: Change to be stateless
sdk.auth(TOKEN);

import {v2Response, TagResponse, SamsaraAsset, SamsaraEquipment, SamsaraVehicle, SamsaraDevice, GetEquipmentResponse, GetVehicleResponse} from "../types/Samsara";

export function createAddress(addressName: string, formattedAddress: string, geofence: object): Promise<void> {
   return new Promise((resolve, reject) => {
       var params = {
           geofence, 
           name: addressName,
           formattedAddress: formattedAddress
       }
       sdk.createAddress(params)
         .then((res: object) => {
           resolve()
       })
         .catch((err: Error) => 
           reject(err));
   })
}

/**
 * @param {string} addressName  - The name of the existing address, the identifier
 * @param {string} tagName  - The name of the new tag
 * @returns {Promise<string>} - the id of the created tag
 */
export function createTagWithAssets(addressName: string, tagName: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        let assetIDs = await getAllAssetIDsInLocation(addressName)
        sdk.createTag({name: tagName, assets: assetIDs}).then((res: TagResponse) => {
            console.log("Created tag with ID: ", res["data"]["id"])
            resolve(res.data.id)
        }).catch((err: Error) => 
            reject(err))
    })
}

export function updateTagAssets(addressName: string, tagID: string, tagName: string): Promise<string>{
    return new Promise(async (resolve, reject) => {
        
        let assetIDs = await getAllAssetIDsInLocation(addressName)
        /**
         * Added For testing DELETE IN PRODUCTION
         */
        //assetIDs = assetIDs.slice(0, assetIDs.length - 2)
        // End Delete
        sdk.replaceTag({assets: assetIDs, name: tagName}, {id: tagID}).then((res: TagResponse) => {
            resolve(res.data.id)
        }).catch((err: Error) => 
            reject(err))
    })
}

async function getAllAssetIDsInLocation(addressName: string): Promise<string[]> {
    var assets = (await sdk.V1getAllAssetCurrentLocations())["assets"]

    var filtered_assets = assets.filter((e: SamsaraAsset) => e.location && e.location[0].location === addressName )
    return filtered_assets.map((e: SamsaraAsset) => String(e["id"]))
}

export async function getAllEquipment(tagID:string): Promise<SamsaraDevice[]> {
    return new Promise((resolve, reject) => {
        sdk.getEquipmentLocations({tagIds: tagID}).then((res:GetEquipmentResponse) => {
            resolve(res.data.map(equipmentToDevice))
        }).catch((err: Error) => reject(err))
    })
}
export async function getAllVehicles(tagID:string): Promise<SamsaraDevice[]> {
    return new Promise((resolve, reject) => {
        sdk.getVehicleStats({tagIds: tagID, types: 'gps'}).then((res: GetVehicleResponse) => {
            resolve(res.data.map(vehicleToDevice))
        }).catch((err: Error) => reject(err))
    }) 
}

function equipmentToDevice(obj: SamsaraEquipment): SamsaraDevice {
    return {id: obj.id, name: obj.name, latitude: obj.location.latitude, longitude: obj.location.longitude}
}
function vehicleToDevice(obj: SamsaraVehicle): SamsaraDevice {
    return {id: obj.id, name: obj.name, latitude: obj.gps.latitude, longitude: obj.gps.longitude}
}


//module.exports = {getAllVehicles, getAllEquipment, preprocess, updateTagAssets, createTagWithAssets, getAllAssetsInLocation}