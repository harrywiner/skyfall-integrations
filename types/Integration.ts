import TelemetryDatum from './TelemetryDatum'
import TelemetryDevice from './TelemetryDevice'

export default interface Integration {
	discover(): Promise<TelemetryDevice[]>,
	update(): Promise<TelemetryDatum[]>
}