export interface v2Response {
    data: object[]
}

export interface GetEquipmentResponse {
    data: SamsaraEquipment[]
}
export interface GetVehicleResponse {
    data: SamsaraVehicle[]
}
export interface GetAssetResponse {
    data: SamsaraAsset[]
}

export interface TagResponse {
    data: {
        id: string
    }
}

export interface SamsaraDevice {
    id: string,
    name: string,
    latitude: number,
    longitude: number
}

export interface SamsaraAsset {
    id: string
    name: string
    location?: [{
        location:string,
        latitude: number,
        longitude: number,
        timeMs: number
    }]
}

export interface SamsaraVehicle {
    id: string,
    name: string,
    gps: {
        time: string,
        latitude: number,
        longitude: number
    }
}

export interface SamsaraEquipment {
    id: string,
    name: string,
    location: {
        latitude: number,
        longitude: number
    }
}