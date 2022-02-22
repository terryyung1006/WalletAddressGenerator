import * as bitcoinLib from 'bitcoinjs-lib'
import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'
import * as bip39 from 'bip39'

const bip32 = BIP32Factory(ecc)

/**
 * @description Check if seed phase has 12 - 24 words (128 bits to 256 bits ENT)
 * 
 * @param seedPhase mnemonic to be checked
 * @returns empty string if passed
 */
export function checkSeedPhase(seedPhase: string): string{
    let seedPhaseArray: Array<string> = seedPhase.split(" ")
    
    if (seedPhaseArray.length < 12 || seedPhaseArray.length > 24) {
        const errMsg = "seed phase must has 12 to 24 words"
        console.error(errMsg)
        return errMsg
    }
    return ""
}

/**
 * @description Check if derivation path has 6 levels
 * 
 * @param path derivation path to be checked
 * @returns empty string if passed
 */
export function checkPath(path: string): string{
    let pathArray: Array<string> = path.split("/")
    
    if (pathArray.length != 6) {
        const errMsg = "derivation path must has 6 level"
        console.error(errMsg)
        return errMsg
    }
    return ""
}

/**
 * @description Generate native segwit address  (prefix "bc1")
 * 
 * @param seedPhase mnemonic for master key pair
 * @param path derivation path for child key pair
 * @returns Segwit address
 */
export function generateSegwitAddress(seedPhase: string, path: string): string | undefined {
    if (!!checkSeedPhase(seedPhase) || !!checkPath(path))
        return undefined
    
    const seed = bip39.mnemonicToSeedSync(seedPhase)
    const root = bip32.fromSeed(seed)

    const child = root.derivePath(path)

    const { address } = bitcoinLib.payments.p2wpkh({
        pubkey: child.publicKey,
        network: bitcoinLib.networks.bitcoin
    })

    return address
}