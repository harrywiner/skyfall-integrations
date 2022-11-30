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
exports.SamsaraLocationIntegration = void 0;
const talus_1 = require("../src/talus");
class SamsaraLocationIntegration {
    constructor(tagName, formattedAddress, geofence, addressName) {
        this.tagName = tagName;
        this.formattedAddress = formattedAddress;
        this.geofence = geofence;
        this.addressName = addressName;
        this.tagID = "3781326";
    }
    /**
     * @returns {Promise<TelemetryObject[]>} - A list of the telemetry devices at the associated event
     */
    discover() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            console.log("Hello World");
            /**
             * Create new tag and address or update the existing tag
            * Thereby discover devices in the geofence
            */
            if (this.tagID === "") {
                yield (0, talus_1.createAddress)(this.addressName, this.formattedAddress, this.geofence);
                var tagID = yield (0, talus_1.createTagWithAssets)(this.addressName, this.tagName).catch(err => { throw err; });
                this.tagID = tagID;
            }
            else {
                yield (0, talus_1.updateTagAssets)(this.addressName, this.tagID, this.tagName)
                    .then((newID) => this.tagID = newID);
            }
            /**
             * Get Discovered devices
             */
            var [vehicles, equipment] = yield Promise.all([(0, talus_1.getAllVehicles)(this.tagID), (0, talus_1.getAllEquipment)(this.tagID)])
                .catch(err => {
                throw err;
            });
            let objs = [...vehicles, ...equipment];
            let devices = objs.map(mapSamsaraToTelemetryObject);
            resolve(devices);
        }));
    }
    update() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var [vehicles, equipment] = yield Promise.all([(0, talus_1.getAllVehicles)(this.tagID), (0, talus_1.getAllEquipment)(this.tagID)])
                .catch(err => {
                throw err;
            });
            let objs = [...vehicles, ...equipment];
            let data = objs.map(mapSamsaraToTelemetryStatus);
            resolve(data);
        }))
            .catch(err => {
            throw err;
        });
    }
}
exports.SamsaraLocationIntegration = SamsaraLocationIntegration;
function mapSamsaraToTelemetryObject(obj) {
    try {
        var name = obj.name;
        var id = String(obj["id"]);
        var device = {
            identifier: id,
            name: name
        };
        return device;
    }
    catch (err) {
        throw err;
    }
}
function mapSamsaraToTelemetryStatus(obj) {
    try {
        var location = {
            longitude: obj.longitude,
            latitude: obj.latitude
        };
        var id = String(obj["id"]);
        var datum = {
            identifier: id,
            location
        };
        return datum;
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=SamsaraLocationIntegration.js.map