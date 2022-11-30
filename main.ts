import {SamsaraLocationIntegration} from './integrations/SamsaraLocationIntegration'
import ZeroNoxIntegration from './integrations/ZeroNoxIntegration'
import { filterObjectsByStatusInGeofence } from './src/zeronox'
import Geofence from './types/Geofence'
import TelemetryStatus from './types/TelemetryStatus'

const GEOFENCE = {"circle": {
    "latitude": 34.0522,
    "longitude": -118.2437,
    "radiusMeters": 5000
  }} 
const TEST_ADDRESS = "Los Angeles"
const TEST_TAG = "Test_Los_Angeles"
const TEST_FORMATTED_ADDRESS = "Los Angeles, California, United States";


let coachella_geofence: Geofence = {
        "id": "0",
        "feature_type": "geofence",
        "name": "Coachella",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [33.685508, -116.251415],
              [33.685490, -116.233701],
              [33.671033, -116.233850],
              [33.671074, -116.251341],
              [33.685508, -116.251415]
            ]
          ]
        }
      }

let testStatus: TelemetryStatus = [
  {
    identifier: 'brickworks0',
    location: { latitude: 33.7219755, longitude: -117.839427233 }
  },
  {
    identifier: 'brickworks1',
    location: { latitude: 33.67826265, longitude: -116.244198733 }
  },
  {
    identifier: 'brickworks2',
    location: { latitude: 33.721871333, longitude: -117.839467767 }
  },
  {
    identifier: 'brickworks3',
    location: { latitude: 33.681458733, longitude: -116.236159 }
  },
  {
    identifier: 'brickworks4',
    location: { latitude: 33.68423475, longitude: -116.236144833 }
  },
  {
    identifier: 'brickworks5',
    location: { latitude: 33.721889683, longitude: -117.839477667 }
  },
  {
    identifier: 'brickworks6',
    location: { latitude: 33.683705833, longitude: -116.234714633 }
  },
  {
    identifier: 'brickworks7',
    location: { latitude: 33.7218826, longitude: -117.83943525 }
  },
  {
    identifier: 'brickworks8',
    location: { latitude: 33.684660167, longitude: -116.23838445 }
  },
  {
    identifier: 'brickworks9',
    location: { latitude: 33.676821533, longitude: -116.2390689 }
  }
]
var zeronox = new ZeroNoxIntegration(coachella_geofence)

zeronox.authenticate().then(token => {
  if (token !== undefined) {
    zeronox.update(token)
      .then(objects => console.log(objects))
      .catch(error => console.error(error))
  }
})


console.log(filterObjectsByStatusInGeofence([], coachella_geofence))