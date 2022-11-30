import TelemetryStatus from './TelemetryStatus'
import TelemetryObject from './TelemetryObject'

export default interface Integration {
	discover(): Promise<TelemetryObject[]>,
	update(): Promise<TelemetryStatus[]>
}