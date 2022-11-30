export default interface Geofence {
    id: string,
    feature_type: string,
    geometry: Polygon
    name?: string,
}

interface Polygon {
    type: string,
    coordinates: [number,number][][] // latitude, longitude
}