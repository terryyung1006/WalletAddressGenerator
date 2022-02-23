import * as MultiSigP2SHAddressGenerator from "../MultiSigP2SHAddressGenerator"

describe("Test MultiSig P2SH bitcoin address generation", () => {
    test("Successful case", async() => {
        let n = 2
        let m = 3
        let publicKeys = [
            '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
            '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
            '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        ]

        let address: string | undefined = MultiSigP2SHAddressGenerator.generateMultiSigP2SHAddress(n, m, publicKeys)

        expect(address).toEqual("3DQoEFJEWqJYqmrkdV5gPRNrnZv9ompoEr")
    })

    test("Failed case, n > m", async() => {
        let n = 4
        let m = 3
        let publicKeys = [
            '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
            '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
            '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        ]

        let address: string | undefined = MultiSigP2SHAddressGenerator.generateMultiSigP2SHAddress(n, m, publicKeys)

        expect(address).toBeUndefined()

        let errMsg: string = MultiSigP2SHAddressGenerator.checkParams(n, m, publicKeys)

        expect(errMsg).toEqual("param m must be greater or equals to n")
    })

    test("Failed case, n || m <=0", async() => {
        let n = 0
        let m = 0
        let publicKeys = [
            '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
            '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
            '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        ]

        let address: string | undefined = MultiSigP2SHAddressGenerator.generateMultiSigP2SHAddress(n, m, publicKeys)

        expect(address).toBeUndefined()

        let errMsg: string = MultiSigP2SHAddressGenerator.checkParams(n, m, publicKeys)

        expect(errMsg).toEqual("input m and n must be greater than 0")
    })

    test("Failed case, m != length public keys array", async() => {
        let n = 2
        let m = 4
        let publicKeys = [
            '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
            '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
            '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        ]

        let address: string | undefined = MultiSigP2SHAddressGenerator.generateMultiSigP2SHAddress(n, m, publicKeys)

        expect(address).toBeUndefined()

        let errMsg: string = MultiSigP2SHAddressGenerator.checkParams(n, m, publicKeys)

        expect(errMsg).toEqual("length of public keys must equal to n")
    })
})