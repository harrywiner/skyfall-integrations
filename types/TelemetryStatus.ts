export default interface TelemetryStatus {
    identifier: any,
    location?: LocationObject,
    batteryCharge?: number
}

interface LocationObject {
    latitude: number,
    longitude: number
}