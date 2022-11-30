import Integration from "../types/Integration"

require('dotenv').config()
const TOKEN = process.env.ZERONOX_TOKEN
if (TOKEN === undefined) {
    throw Error("No token found")
}

import { getObjectsAndStatus } from "../src/zeronox"

export default class ZeroNoxIntegration implements Integration {

    authenticate() {
        return Promise.resolve(TOKEN)
    }

    discover(token: string) {
        return getObjectsAndStatus(token)
    }

    update(token: string) {
        return Promise.resolve([])
    }
}