import * as bitcoinLib from 'bitcoinjs-lib'
import { bitcoin } from 'bitcoinjs-lib/src/networks'

export function checkParams(m: number, n: number, publicKeys: Array<string>): string{
    if (m > n) {
        const errMsg = "param m must be greater than n"
        console.error(errMsg)
        return errMsg
    }
    if (m <= 0 || n <= 0) {
        const errMsg = "input m and n must be greater than 0"
        console.error(errMsg)
        return errMsg
    }
    if (n != publicKeys.length) {
        const errMsg = "length of public keys must equal to n"
        console.error(errMsg)
        return errMsg
    }

    return ""
}

export function generateMultiSigP2SHAddress(m: number, n: number, publicKeys: Array<string>): string | undefined{
    if (checkParams(m, n, publicKeys) != "") {
        return undefined
    }

    const pubkeysBuffer: Buffer[] = publicKeys.map(hex => Buffer.from(hex, 'hex'))
    
    if (pubkeysBuffer.length <= 0 || pubkeysBuffer.length != n) {
        console.error("public key buffer not equal to param n")
        return undefined
    }

    const { address } = bitcoinLib.payments.p2sh({
        redeem: bitcoinLib.payments.p2ms({
            m,
            pubkeys: pubkeysBuffer
        })
    })

    return address
}