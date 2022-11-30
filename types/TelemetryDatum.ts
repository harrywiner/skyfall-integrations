export default interface TelemetryDatum {
    identifier: any,
    location?: LocationObject,
    batteryCharge?: number
}

interface LocationObject {
    latitude: number,
    longitude: number
}