import TelemetryStatus from './TelemetryStatus'
import TelemetryObject from './TelemetryObject'

export default interface Integration {
	authenticate(): Promise<string|undefined>,
	discover(token?: string): Promise<TelemetryObject[]>,
	update(token?: string): Promise<TelemetryStatus[]>
}