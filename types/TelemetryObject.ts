import TelemetryStatus from "./TelemetryStatus"
export default interface TelemetryObject {
    identifier: any, 
    name: string,
    status?: TelemetryStatus
}