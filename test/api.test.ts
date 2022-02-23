import request from 'supertest'
import app from '../app'

describe("API testing", () => {
    test("Health check for default local port",async () => {
        const resp = await request(app).get("/healthcheck")
        expect(resp.text).toEqual("Hello")
        expect(resp.status).toEqual(200)
    })

    describe("Segwit address generation api test", () => {
        test("Successful case", async () => {
            const resp = await request(app).get("/hd_segwit_address/next%20useful%20elbow%20nurse%20surround%20model%20axis%20item%20trick%20exhaust%20file%20warrior/m%2F44%27%2F60%27%2F0%27%2F0%2F2")
            expect(resp.text).toEqual("bc1q0jlhtwh6l95kz9r5n90qxd5lhlam4nhmymr3xn")
            expect(resp.status).toEqual(200)
        })

        test("Failed case, input param 'seed phase' length invalid", async () => {
            const resp = await request(app).get("/hd_segwit_address/next%20useful%20elbow%20nurse%20surround%20model%20axis%20item%20trick%20exhaust%20file/m%2F44%27%2F60%27%2F0%27%2F0%2F2")
            expect(resp.text).toEqual("seed phase must has 12 to 24 words")
            expect(resp.status).toEqual(412)
        })

        test("Failed case, input param 'path' invalid", async () => {
            const resp = await request(app).get("/hd_segwit_address/next%20useful%20elbow%20nurse%20surround%20model%20axis%20item%20trick%20exhaust%20file%20warrior/m%2F44%27%2F60%27%2F0%27%2F0")
            expect(resp.text).toEqual("derivation path must has 6 level")
            expect(resp.status).toEqual(412)
        })
    })
    
    describe("P2SH address generation api test", () => {
        test("Successful case", async () => {
            const resp = await request(app).get("/p2sh_address/2/3/02e135e12b4417b41e92e738448cb51581c70f14bf885b0d4056ac2c3cc5c8729c,022015b568fb0f2f792e2e1d230a7f64e8a75b5d4a3ae549b55c3724cdc148b32c,02799dc04a8acf04e793ff0f2c35c20c0388529eb964c565a455f13c07123c9ea2")
            expect(resp.text).toEqual("3KN1RSpNKNeXbUBw5DbNjaWFyiet8XdSeZ")
            expect(resp.status).toEqual(200)
        })
        
        test("Failed case, n > m", async () => {
            const resp = await request(app).get("/p2sh_address/4/3/02e135e12b4417b41e92e738448cb51581c70f14bf885b0d4056ac2c3cc5c8729c,022015b568fb0f2f792e2e1d230a7f64e8a75b5d4a3ae549b55c3724cdc148b32c,02799dc04a8acf04e793ff0f2c35c20c0388529eb964c565a455f13c07123c9ea2")
            expect(resp.text).toEqual("param m must be greater or equals to n")
            expect(resp.status).toEqual(412)
        })

        test("Failed case, n || m <= 0", async () => {
            const resp = await request(app).get("/p2sh_address/0/3/02e135e12b4417b41e92e738448cb51581c70f14bf885b0d4056ac2c3cc5c8729c,022015b568fb0f2f792e2e1d230a7f64e8a75b5d4a3ae549b55c3724cdc148b32c,02799dc04a8acf04e793ff0f2c35c20c0388529eb964c565a455f13c07123c9ea2")
            expect(resp.text).toEqual("input m and n must be greater than 0")
            expect(resp.status).toEqual(412)
        })

        test("Failed case, m != public_keys length", async () => {
            const resp = await request(app).get("/p2sh_address/2/2/02e135e12b4417b41e92e738448cb51581c70f14bf885b0d4056ac2c3cc5c8729c,022015b568fb0f2f792e2e1d230a7f64e8a75b5d4a3ae549b55c3724cdc148b32c,02799dc04a8acf04e793ff0f2c35c20c0388529eb964c565a455f13c07123c9ea2")
            expect(resp.text).toEqual("length of public keys must equal to n")
            expect(resp.status).toEqual(412)
        })
    })
})