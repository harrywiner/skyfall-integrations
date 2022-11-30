"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVehicles = exports.getAllEquipment = exports.updateTagAssets = exports.createTagWithAssets = exports.createAddress = void 0;
/**
 * Samsara API functionality
 */
require('dotenv').config();
const TOKEN = process.env.SAMSARA_TOKEN;
if (TOKEN === undefined) {
    throw Error("No token found");
}
const sdk = require('api')('@samsara-dev-rel/v2019.01.01#2xqng621f6l8vvz9pu');
sdk.auth(TOKEN);
function createAddress(addressName, formattedAddress, geofence) {
    return new Promise((resolve, reject) => {
        var params = {
            geofence,
            name: addressName,
            formattedAddress: formattedAddress
        };
        sdk.createAddress(params)
            .then((res) => {
            resolve();
        })
            .catch((err) => reject(err));
    });
}
exports.createAddress = createAddress;
/**
 * @param {string} addressName  - The name of the existing address, the identifier
 * @param {string} tagName  - The name of the new tag
 * @returns {Promise<string>} - the id of the created tag
 */
function createTagWithAssets(addressName, tagName) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let assetIDs = yield getAllAssetIDsInLocation(addressName);
        sdk.createTag({ name: tagName, assets: assetIDs }).then((res) => {
            console.log("Created tag with ID: ", res["data"]["id"]);
            resolve(res.data.id);
        }).catch((err) => reject(err));
    }));
}
exports.createTagWithAssets = createTagWithAssets;
function updateTagAssets(addressName, tagID, tagName) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let assetIDs = yield getAllAssetIDsInLocation(addressName);
        /**
         * Added For testing DELETE IN PRODUCTION
         */
        //assetIDs = assetIDs.slice(0, assetIDs.length - 2)
        // End Delete
        sdk.replaceTag({ assets: assetIDs, name: tagName }, { id: tagID }).then((res) => {
            resolve(res.data.id);
        }).catch((err) => reject(err));
    }));
}
exports.updateTagAssets = updateTagAssets;
function getAllAssetIDsInLocation(addressName) {
    return __awaiter(this, void 0, void 0, function* () {
        var assets = (yield sdk.V1getAllAssetCurrentLocations())["assets"];
        var filtered_assets = assets.filter((e) => e.location && e.location[0].location === addressName);
        return filtered_assets.map((e) => String(e["id"]));
    });
}
function getAllEquipment(tagID) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            sdk.getEquipmentLocations({ tagIds: tagID }).then((res) => {
                resolve(res.data.map(equipmentToDevice));
            }).catch((err) => reject(err));
        });
    });
}
exports.getAllEquipment = getAllEquipment;
function getAllVehicles(tagID) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            sdk.getVehicleStats({ tagIds: tagID, types: 'gps' }).then((res) => {
                resolve(res.data.map(vehicleToDevice));
            }).catch((err) => reject(err));
        });
    });
}
exports.getAllVehicles = getAllVehicles;
function equipmentToDevice(obj) {
    return { id: obj.id, name: obj.name, latitude: obj.location.latitude, longitude: obj.location.longitude };
}
function vehicleToDevice(obj) {
    return { id: obj.id, name: obj.name, latitude: obj.gps.latitude, longitude: obj.gps.longitude };
}
//module.exports = {getAllVehicles, getAllEquipment, preprocess, updateTagAssets, createTagWithAssets, getAllAssetsInLocation}
//# sourceMappingURL=talus.js.map