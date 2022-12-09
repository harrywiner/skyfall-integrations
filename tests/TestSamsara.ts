import {SamsaraLocationIntegration} from '../integrations/SamsaraLocationIntegration'


/**
 * Inputs required by the Address Creation API
 * Sample geofence for central LA
 */
const GEOFENCE = {"circle": {
    "latitude": 34.0522,
    "longitude": -118.2437,
    "radiusMeters": 5000
  }} 
const TEST_ADDRESS = "Los Angeles"
const TEST_TAG = "Test_Los_Angeles"
const TEST_FORMATTED_ADDRESS = "Los Angeles, California, United States";

var samsara = new SamsaraLocationIntegration(TEST_TAG, TEST_FORMATTED_ADDRESS, GEOFENCE, TEST_ADDRESS)

// samsara.discover().then(devices => {
//     console.log(devices, null, 2)
// }).catch(
//     (err) => 
//     console.error(err))

async function main() {
  await samsara.discover().then(devices => {
      console.log(devices, null, 2)
  }).catch(
      (err) => 
      console.error(err))
  
  await samsara.update().then(data => {
      console.log(data, null, 2)
  }).catch(err =>{ console.error(err)})
}

main()