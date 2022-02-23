import * as HDSegwitAddressGenerator from "../HDSegwitAddressGenerator"

describe("Test Hierarchical Deterministic Segregated Witness bitcoin address generation.", () => {
    test("Successful case", async() => {
        let seedPhase = "recycle manual power sense program car car toy judge response wave chicken"
        let path = "m/44'/60'/0'/0/0"

        let address: string | undefined = HDSegwitAddressGenerator.generateSegwitAddress(seedPhase, path)

        expect(address).toEqual("bc1q67e5lsytn84089w50ph2manuyyc6gk69u2xa2q")
    })

    test("Failed case, invalid seed phase", async() => {
        let seedPhase = "recycle manual power sense program car car toy judge response wave"
        let path = "m/44'/60'/0'/0/0"

        let address: string | undefined = HDSegwitAddressGenerator.generateSegwitAddress(seedPhase, path)

        expect(address).toBeUndefined()

        let errMsg = HDSegwitAddressGenerator.checkSeedPhase(seedPhase)
        expect(errMsg).toEqual("seed phase must has 12 to 24 words")
    })

    test("Failed case, invalid derivation path", async() => {
        let seedPhase = "recycle manual power sense program car car toy judge response wave chicken"
        let path = "m/44'/60'/0'/0/"

        let address: string | undefined = HDSegwitAddressGenerator.generateSegwitAddress(seedPhase, path)

        expect(address).toBeUndefined()
    })
})