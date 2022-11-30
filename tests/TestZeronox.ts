import ZeroNoxIntegration from '../integrations/ZeroNoxIntegration'
import { filterObjectsByStatusInGeofence } from '../src/ZeroNoxApi'
import Geofence from '../types/Geofence'
import TelemetryStatus from '../types/TelemetryStatus'


/**
 * Sample Geofence for coachella
 */
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

var zeronox = new ZeroNoxIntegration(coachella_geofence)

zeronox.authenticate().then(token => {
    if (token !== undefined) {
    zeronox.discover(token)
        .then(objects => {
            console.log("DISCOVER: ")
            console.log(objects)
        })

    zeronox.update(token)
        .then(status => {
            console.log("UPDATE: ")
            console.log(status)
        })
        .catch(error => console.error(error))
    }
})


console.log(filterObjectsByStatusInGeofence([], coachella_geofence))