"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SamsaraLocationIntegration_1 = require("./integrations/SamsaraLocationIntegration");
const GEOFENCE = { "circle": {
        "latitude": 34.0522,
        "longitude": -118.2437,
        "radiusMeters": 5000
    } };
const TEST_ADDRESS = "Los Angeles";
const TEST_TAG = "Test_Los_Angeles";
const TEST_FORMATTED_ADDRESS = "Los Angeles, California, United States";
var samsara = new SamsaraLocationIntegration_1.SamsaraLocationIntegration(TEST_TAG, TEST_FORMATTED_ADDRESS, GEOFENCE, TEST_ADDRESS);
// samsara.discover().then(devices => {
//     console.log(devices, null, 2)
// }).catch(
//     (err) => 
//     console.error(err))
samsara.update().then(data => {
    console.log(data, null, 2);
}).catch(err => { console.error(err); });
//# sourceMappingURL=main.js.map