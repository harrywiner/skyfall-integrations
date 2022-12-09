export interface TokenResponse {
    access_token: string,
    expires_in: number,
    token_type: string,
    scope: string
}

export interface StatusResponse {
    telematicsDeviceBase: {
        serialNum: string,
        hardwareVersion: string,
        osVersion: string,
        softwareVersion: string,
        vin: string,
        dataLinkType: string,
        lastDeviceConnection: string,
        lastDataLinkConnection: null,
        updateUserId: null,
    },
    connectionTypeEvents: [
        {
        changeDateTime: string,
        teleDeviceId: string,
        dataTransferTypeId: number,
        endPoint: null,
        dataTransferTypeDescription: string,
        },
    ],
    deviceTeleMaticsData: {
        id: number,
        messageIndex: number,
        vin: string,
        teleDeviceId: string,
        recordDateTime: string,
        writeDateTime: string,
        recordUTCCode: null,
        writeUTCCode: null,
        stateOfCharge: null,
    },
    deviceGpsData: {
        id: number,
        msgIndex: number,
        vin: string,
        teleDeviceId: string,
        messageDateTime: string,
        writeDateTime: string,
        longitude: number,
        latitude: number,
        height: number,
        messageUTCCode: null,
        writeUTCCode: null,
    },
}