import * as bitcoinLib from 'bitcoinjs-lib'

/**
 * @description check if params of generateMultiSigP2SHAddress valid
 * 
 * @param n minimum number of private keys to unlock UTXO
 * @param m total number of key pairs
 * @param publicKeys array of public keys, length should be same as n
 * @returns 
 */
export function checkParams(n: number, m: number, publicKeys: Array<string>): string{
    if (n > m) {
        const errMsg = "param m must be greater or equals to n"
        console.error(errMsg)
        return errMsg
    }
    if (m <= 0 || n <= 0) {
        const errMsg = "input m and n must be greater than 0"
        console.error(errMsg)
        return errMsg
    }
    if (m != publicKeys.length) {
        const errMsg = "length of public keys must equal to n"
        console.error(errMsg)
        return errMsg
    }

    return ""
}

/**
 * @description Generate Pay-to-Script-Hash(P2SH) bitcoin address(prefix "3") with Pay-to-multisig address (n out of m).
 * 
 * @param n minimum number of private keys to unlock UTXO
 * @param m total number of key pairs
 * @param publicKeys array of public keys, length should be same as n
 * @returns 
 */
export function generateMultiSigP2SHAddress(n: number, m: number, publicKeys: Array<string>): string | undefined{
    if (checkParams( n, m, publicKeys) != "") {
        return undefined
    }

    const pubkeysBuffer: Buffer[] = publicKeys.map(hex => Buffer.from(hex, 'hex'))
    
    if (pubkeysBuffer.length <= 0 || pubkeysBuffer.length != m) {
        console.error("public key buffer length not equal to param m")
        return undefined
    }

    const { address } = bitcoinLib.payments.p2sh({
        redeem: bitcoinLib.payments.p2ms({
            m: n,
            pubkeys: pubkeysBuffer
        })
    })

    return address
}